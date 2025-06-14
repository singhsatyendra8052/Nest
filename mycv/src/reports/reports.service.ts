import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';
@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    // console.log('Approving report with ID:', id, 'Approved:', approved);
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new Error(`Report with id ${id} not found`);
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    // Here you would implement the logic to create an estimate based on the query parameters
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: estimateDto.year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({
        mileage: estimateDto.mileage,
      })
      .limit(3)
      .getRawMany();
  }
}
