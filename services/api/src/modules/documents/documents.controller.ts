import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { DocumentsService } from "./documents.service";
import { VerifyDocumentDto } from "./dto/documents.dto";

@Controller("applications/:applicationId")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get("documents")
  listChecklist(@CurrentUser() user: AuthenticatedUser, @Param("applicationId") applicationId: string) {
    return this.documentsService.listChecklist(user, applicationId);
  }

  @Post("documents/:documentId/upload")
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Param("documentId") documentId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.upload(user, applicationId, documentId, file);
  }

  @Post("documents/:documentId/verify")
  verify(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Param("documentId") documentId: string,
    @Body() dto: VerifyDocumentDto,
  ) {
    return this.documentsService.verify(user, applicationId, documentId, dto);
  }

  @Post("invitation-letter")
  generateInvitationLetter(@CurrentUser() user: AuthenticatedUser, @Param("applicationId") applicationId: string) {
    return this.documentsService.generateInvitationLetter(user, applicationId);
  }
}

/**
 * Resolves the dev-adapter download URLs produced by StorageService.resolveDownloadUrl.
 * In production this whole controller is replaced by real short-lived signed S3 URLs
 * and the API never proxies file bytes itself — see
 * docs/03-architecture/06-storage-caching-search.md §1. This dev stand-in requires a
 * valid access token (any authenticated user) plus knowledge of the random per-file
 * key, but — unlike the real endpoints above — does NOT re-verify that the caller is
 * actually a party to the specific case the file belongs to. Treat this route as
 * strictly a local/demo convenience, never as a template for the real implementation.
 */
@Controller("internal/documents")
export class InternalDocumentDownloadController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(":key")
  download(@Param("key") key: string) {
    return this.documentsService.downloadFile(key);
  }
}
