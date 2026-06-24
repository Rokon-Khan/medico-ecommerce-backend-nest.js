import { Module } from '@nestjs/common';
import { WhoWeAreService } from './who-we-are.service';
import { WhoWeAreController } from './who-we-are.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhoWeAre } from './entities/who-we-are.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhoWeAre])],
  controllers: [WhoWeAreController],
  providers: [WhoWeAreService],
  exports: [WhoWeAreService],
})
export class WhoWeAreModule {}
