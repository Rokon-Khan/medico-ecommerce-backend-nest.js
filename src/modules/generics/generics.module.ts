import { Module } from '@nestjs/common';
import { GenericsService } from './generics.service';
import { GenericsController } from './generics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generic } from './entities/generic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Generic])],
  controllers: [GenericsController],
  providers: [GenericsService],
  exports: [GenericsService],
})
export class GenericsModule {}
