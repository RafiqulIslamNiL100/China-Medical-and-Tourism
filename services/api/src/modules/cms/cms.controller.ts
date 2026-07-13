import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { CmsService } from "./cms.service";
import { CreateArticleDto, UpdateArticleDto } from "./dto/cms.dto";

@Controller("articles")
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Public()
  @Get()
  listPublished(@Query("category") category?: string) {
    return this.cmsService.listPublished(category);
  }

  @Post()
  @Roles(UserRole.admin)
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateArticleDto) {
    return this.cmsService.create(user, dto);
  }

  @Public()
  @Get(":slug")
  getBySlug(@Param("slug") slug: string) {
    return this.cmsService.getBySlug(slug);
  }

  @Patch(":slug")
  @Roles(UserRole.admin)
  update(@CurrentUser() user: AuthenticatedUser, @Param("slug") slug: string, @Body() dto: UpdateArticleDto) {
    return this.cmsService.update(user, slug, dto);
  }
}
