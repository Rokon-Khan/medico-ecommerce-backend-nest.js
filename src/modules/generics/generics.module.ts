import { Module } from '@nestjs/common';
import { GenericsService } from './generics.service';
import { GenericsController } from './generics.controller';

@Module({
  controllers: [GenericsController],
  providers: [GenericsService],
})
export class GenericsModule {}
