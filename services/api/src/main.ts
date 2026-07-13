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
  app.setGlobalPrefix("v1", { exclude: ["health"] });

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
  // eslint-disable-next-line no-console
  console.log(`CMT API listening on http://0.0.0.0:${port}/v1`);
}

bootstrap();
