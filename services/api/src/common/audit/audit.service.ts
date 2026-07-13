import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface AuditInput {
  actorUserId?: string;
  actorLabel: string;
  action: string;
  targetType: string;
  targetId?: string;
  targetLabel?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Writes to the append-only AuditLog table (NFR-SEC-07, BR-30). This service only ever
 * INSERTs — there is deliberately no update/delete method here, matching that no
 * write/delete endpoint for the audit log exists anywhere in api/openapi.yaml.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: AuditInput): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        actorLabel: input.actorLabel,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        targetLabel: input.targetLabel,
        metadata: input.metadata as any,
      },
    });
  }
}
