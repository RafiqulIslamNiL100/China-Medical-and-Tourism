import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  // rawBody: true — needed so the Stripe webhook handler can verify the signature
  // against the exact bytes Stripe sent, before the body gets JSON-parsed.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  // Behind Railway's (or any PaaS) reverse proxy — needed so req.ip reflects the real
  // client for rate limiting rather than the proxy's address.
  app.set("trust proxy", 1);

  app.use(helmet());
  // Both health paths are excluded from prefix rewriting so the literal routes in
  // health.controller.ts serve as-is: /health (canonical) and /v1/health (alias).
  app.setGlobalPrefix("v1", { exclude: ["health", "v1/health"] });

  // CORS_ORIGINS: comma-separated allowlist (e.g. "https://china-medical-and-tourism.vercel.app").
  // Unset = allow all origins, for local development only — always set it in production.
  const corsOrigins = process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean);
  app.enableCors({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port, "0.0.0.0");
  // The PORT detail matters operationally: if the platform injects PORT but its edge
  // proxy targets a different port (e.g. a domain pinned to 3001 while PORT=8080),
  // every request dies with "Application failed to respond" even though the app is
  // healthy — this line makes that mismatch visible in the runtime logs immediately.
  // eslint-disable-next-line no-console
  console.log(
    `CMT API listening on http://0.0.0.0:${port} (PORT env: ${process.env.PORT ?? "unset — defaulted to 3001"}). ` +
      `Ensure the platform's public domain targets this exact port.`,
  );
}

bootstrap();
