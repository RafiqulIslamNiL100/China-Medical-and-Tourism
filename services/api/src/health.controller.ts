import { Controller, Get } from "@nestjs/common";
import { Public } from "./common/decorators/public.decorator";
import { PrismaService } from "./common/prisma/prisma.service";

/**
 * Served at BOTH /health and /v1/health (each is excluded from global-prefix
 * rewriting in main.ts, so the paths below are literal). /health is the canonical
 * path most PaaS health checks default to; /v1/health exists because people
 * reasonably assume the API prefix applies and probe that URL when diagnosing
 * a deployment.
 */
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get(["health", "v1/health"])
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
