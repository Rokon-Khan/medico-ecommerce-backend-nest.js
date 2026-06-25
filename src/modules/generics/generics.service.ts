import { Injectable } from '@nestjs/common';
import { CreateGenericDto } from './dto/create-generic.dto';
import { UpdateGenericDto } from './dto/update-generic.dto';

@Injectable()
export class GenericsService {
  create(createGenericDto: CreateGenericDto) {
    return 'This action adds a new generic';
  }

  findAll() {
    return `This action returns all generics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generic`;
  }

  update(id: number, updateGenericDto: UpdateGenericDto) {
    return `This action updates a #${id} generic`;
  }

  remove(id: number) {
    return `This action removes a #${id} generic`;
  }
}
