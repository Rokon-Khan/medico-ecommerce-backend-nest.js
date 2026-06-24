import { Module } from '@nestjs/common';
import { WhoWeAreFeaturesService } from './who-we-are-features.service';
import { WhoWeAreFeaturesController } from './who-we-are-features.controller';
import { WhoWeAre } from '../who-we-are/entities/who-we-are.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhoWeAreFeature } from './entities/who-we-are-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhoWeAreFeature, WhoWeAre])],
  controllers: [WhoWeAreFeaturesController],
  providers: [WhoWeAreFeaturesService],
  exports: [WhoWeAreFeaturesService],
})
export class WhoWeAreFeaturesModule {}
