import { Injectable } from "@nestjs/common";
import { ArticleStatus, UserRole } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CreateArticleDto, UpdateArticleDto } from "./dto/cms.dto";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublished(category?: string) {
    return this.prisma.article.findMany({
      where: { status: ArticleStatus.Published, ...(category ? { category } : {}) },
      orderBy: { publishedAt: "desc" },
    });
  }

  async getBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article || article.status !== ArticleStatus.Published) {
      throw AppException.notFound("ARTICLE_NOT_FOUND", "Article not found.");
    }
    return article;
  }

  async create(user: AuthenticatedUser, dto: CreateArticleDto) {
    this.requireAdmin(user);
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.title);

    const existing = await this.prisma.article.findUnique({ where: { slug } });
    if (existing) throw AppException.conflict("SLUG_IN_USE", "An article with this slug already exists.");

    return this.prisma.article.create({
      data: {
        slug,
        title: dto.title,
        excerpt: dto.excerpt,
        body: dto.body,
        category: dto.category,
        authorUserId: user.userId,
        status: ArticleStatus.Draft,
      },
    });
  }

  async update(user: AuthenticatedUser, slug: string, dto: UpdateArticleDto) {
    this.requireAdmin(user);
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) throw AppException.notFound("ARTICLE_NOT_FOUND", "Article not found.");

    const willPublish = dto.status === "Published" && article.status !== ArticleStatus.Published;

    return this.prisma.article.update({
      where: { id: article.id },
      data: {
        title: dto.title ?? article.title,
        excerpt: dto.excerpt ?? article.excerpt,
        body: dto.body ?? article.body,
        category: dto.category ?? article.category,
        status: dto.status ?? article.status,
        publishedAt: willPublish ? new Date() : article.publishedAt,
      },
    });
  }

  private requireAdmin(user: AuthenticatedUser) {
    if (user.role !== UserRole.admin) throw AppException.forbidden();
  }
}
