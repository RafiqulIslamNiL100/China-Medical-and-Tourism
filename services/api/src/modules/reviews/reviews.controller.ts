import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, ModerateReviewDto } from "./dto/reviews.dto";

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post("reviews")
  @Roles(UserRole.patient)
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user, dto);
  }

  @Public()
  @Get("hospitals/:hospitalId/reviews")
  listForHospital(@Param("hospitalId") hospitalId: string) {
    return this.reviewsService.listApprovedForHospital(hospitalId);
  }

  @Get("admin/reviews")
  @Roles(UserRole.admin)
  listPendingModeration(@CurrentUser() user: AuthenticatedUser) {
    return this.reviewsService.listPendingModeration(user);
  }

  @Post("admin/reviews/:reviewId/moderate")
  @Roles(UserRole.admin)
  moderate(
    @CurrentUser() user: AuthenticatedUser,
    @Param("reviewId") reviewId: string,
    @Body() dto: ModerateReviewDto,
  ) {
    return this.reviewsService.moderate(user, reviewId, dto);
  }
}
