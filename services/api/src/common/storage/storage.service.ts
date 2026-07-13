import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

/**
 * Local-disk storage adapter — the dev/demo stand-in for the S3-compatible object
 * storage described in docs/03-architecture/06-storage-caching-search.md §1 (private
 * `documents` bucket, signed-URL access). Swap this implementation for a real S3 SDK
 * client behind the same two methods when deploying; nothing above this layer
 * (DocumentsService, controllers) needs to change.
 */
@Injectable()
export class StorageService {
  private readonly root = join(process.cwd(), ".data", "documents");

  async save(originalName: string, buffer: Buffer): Promise<string> {
    await mkdir(this.root, { recursive: true });
    const key = `${randomUUID()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    await writeFile(join(this.root, key), buffer);
    return key;
  }

  /**
   * In production this returns a short-lived signed URL. In this dev adapter it
   * returns an API path the DocumentsController resolves back to the file on disk,
   * so the "never a long-lived direct link stored in the database" property still
   * holds — the fileStorageKey column never contains this URL, only the opaque key.
   */
  resolveDownloadUrl(key: string): string {
    return `/v1/internal/documents/${encodeURIComponent(key)}`;
  }

  filePath(key: string): string {
    return join(this.root, key);
  }
}
