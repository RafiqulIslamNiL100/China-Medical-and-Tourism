import { Module } from "@nestjs/common";
import { DocumentsController, InternalDocumentDownloadController } from "./documents.controller";
import { DocumentsService } from "./documents.service";

@Module({
  controllers: [DocumentsController, InternalDocumentDownloadController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
