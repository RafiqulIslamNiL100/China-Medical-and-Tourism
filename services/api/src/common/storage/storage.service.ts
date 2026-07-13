import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { mkdir, stat, writeFile } from "fs/promises";
import { join } from "path";
import type { Readable } from "stream";

const SIGNED_URL_TTL_SECONDS = 15 * 60;

/**
 * Object storage for uploaded documents, per
 * docs/03-architecture/06-storage-caching-search.md §1 (private `documents` bucket,
 * short-lived signed-URL access).
 *
 * Two modes, chosen at boot from env:
 * - S3 mode — when S3_BUCKET + S3_ACCESS_KEY_ID + S3_SECRET_ACCESS_KEY are set.
 *   Works with AWS S3, Cloudflare R2, Railway Buckets, MinIO, etc. (set S3_ENDPOINT
 *   for non-AWS providers). Download URLs are presigned GET URLs valid for 15
 *   minutes — never long-lived links, and the DB only ever stores the opaque key.
 * - Local-disk mode — the dev fallback when no credentials exist. Files land in
 *   `.data/documents/` and download URLs point at the authenticated
 *   /v1/internal/documents/:key route. Container disk is ephemeral on most PaaS
 *   hosts, so this mode is for development only.
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger("StorageService");
  private readonly root = join(process.cwd(), ".data", "documents");
  private s3: S3Client | null = null;
  private bucket = "";

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const bucket = this.config.get<string>("S3_BUCKET");
    const accessKeyId = this.config.get<string>("S3_ACCESS_KEY_ID");
    const secretAccessKey = this.config.get<string>("S3_SECRET_ACCESS_KEY");

    if (bucket && accessKeyId && secretAccessKey) {
      const endpoint = this.config.get<string>("S3_ENDPOINT");
      this.bucket = bucket;
      this.s3 = new S3Client({
        region: this.config.get<string>("S3_REGION") ?? "auto",
        credentials: { accessKeyId, secretAccessKey },
        ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
      });
      this.logger.log(`S3 storage configured (bucket: ${bucket}) — uploads persist in object storage.`);
    } else {
      this.logger.warn(
        "S3_BUCKET/S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY not set — falling back to local-disk storage. " +
          "Uploads will NOT survive container restarts; do not use this mode in production.",
      );
    }
  }

  async save(originalName: string, buffer: Buffer): Promise<string> {
    const key = `${randomUUID()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    if (this.s3) {
      await this.s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: buffer }));
      return key;
    }

    await mkdir(this.root, { recursive: true });
    await writeFile(join(this.root, key), buffer);
    return key;
  }

  /** Short-lived download URL: presigned S3 GET in S3 mode, internal API path in local mode. */
  async getDownloadUrl(key: string): Promise<string> {
    if (this.s3) {
      return getSignedUrl(this.s3, new GetObjectCommand({ Bucket: this.bucket, Key: key }), {
        expiresIn: SIGNED_URL_TTL_SECONDS,
      });
    }
    return `/v1/internal/documents/${encodeURIComponent(key)}`;
  }

  /** Readable stream of the object, used by the internal download route. */
  async download(key: string): Promise<Readable> {
    if (this.s3) {
      const result = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
      return result.Body as Readable;
    }

    const path = join(this.root, key);
    await stat(path); // throws if missing — caller translates to 404
    return createReadStream(path);
  }
}
