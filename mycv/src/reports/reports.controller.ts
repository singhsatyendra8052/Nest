import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorators';
import { User } from '../users/users.entity';
import { Serialize } from '../interceptors/serialze.intercept';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    // console.log(query);
    return this.reportsService.createEstimate(query);
  }
  @Patch('/:id')
  @UseGuards(AdminGuard)
  approvedReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    // console.log('Approving report with ID:', id, 'Approved:', body.approved);
    return this.reportsService.changeApproval(id, body.approved);
  }
}
