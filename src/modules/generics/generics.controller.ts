import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenericsService } from './generics.service';
import { CreateGenericDto } from './dto/create-generic.dto';
import { UpdateGenericDto } from './dto/update-generic.dto';

@Controller('generics')
export class GenericsController {
  constructor(private readonly genericsService: GenericsService) {}

  @Post()
  create(@Body() createGenericDto: CreateGenericDto) {
    return this.genericsService.create(createGenericDto);
  }

  @Get()
  findAll() {
    return this.genericsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genericsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenericDto: UpdateGenericDto) {
    return this.genericsService.update(+id, updateGenericDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genericsService.remove(+id);
  }
}
