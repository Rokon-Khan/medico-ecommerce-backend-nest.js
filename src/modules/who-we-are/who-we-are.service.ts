import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { WhoWeAre } from './entities/who-we-are.entity';
import {
  CreateWhoWeAreDto,
  WhoWeAreResponseDto,
} from './dto/create-who-we-are.dto';
import { UpdateWhoWeAreDto } from './dto/update-who-we-are.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class WhoWeAreService {
  constructor(
    @InjectRepository(WhoWeAre)
    private readonly whoWeAreRepo: Repository<WhoWeAre>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create WhoWeAre Entry (WITH IMAGE)
   */
  async create(
    req: Request,
    createDto: CreateWhoWeAreDto,
    file?: Express.Multer.File,
  ): Promise<WhoWeAre> {
    const userId = req?.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    createDto.title = createDto.title.trim();

    const exists = await this.whoWeAreRepo.exists({
      where: { title: createDto.title },
    });
    if (exists) {
      throw new BadRequestException(
        'WhoWeAre entry with this title already exists.',
      );
    }

    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const whoWeAre = this.whoWeAreRepo.create({
      ...createDto,
      added_by: String(userId),
      image: imageUrl,
    });

    return this.whoWeAreRepo.save(whoWeAre);
  }

  /**
   * Get all WhoWeAre Entries (pagination + filters)
   */
  async findAll(query: any): Promise<IPagination<WhoWeAre>> {
    return this.dataQueryService.execute<WhoWeAre>({
      repository: this.whoWeAreRepo,
      alias: 'whoWeAre',
      pagination: query,
      searchableFields: ['title', 'description'],
      select: [
        'id',
        'title',
        'description',
        'image',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * Get single WhoWeAre Entry by ID
   */
  async findOne(id: string): Promise<WhoWeAreResponseDto> {
    const whoWeAre = await this.whoWeAreRepo.findOne({
      where: { id },
      relations: ['addedBy'], // include relation if you track who added it
    });

    if (!whoWeAre) throw new NotFoundException('WhoWeAre entry not found.');

    return {
      id: whoWeAre.id,
      title: whoWeAre.title,
      description: whoWeAre.description,
      image: whoWeAre.image,
      addedBy: whoWeAre.addedBy
        ? {
            id: whoWeAre.addedBy.id,
            name: whoWeAre.addedBy.name,
          }
        : undefined,
      created_at: whoWeAre.created_at,
      updated_at: whoWeAre.updated_at,
    };
  }

  /**
   * Update WhoWeAre Entry (WITH IMAGE)
   */
  async update(
    id: string,
    updateDto: UpdateWhoWeAreDto,
    file?: Express.Multer.File,
  ): Promise<WhoWeAre> {
    const whoWeAre = await this.whoWeAreRepo.findOne({ where: { id } });
    if (!whoWeAre) throw new NotFoundException('WhoWeAre entry not found.');

    if (updateDto.title) {
      updateDto.title = updateDto.title.trim();

      const exists = await this.whoWeAreRepo.exists({
        where: { title: updateDto.title, id: Not(id) },
      });
      if (exists) {
        throw new BadRequestException(
          'WhoWeAre entry with this title already exists.',
        );
      }
    }

    if (file) {
      if (whoWeAre.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: whoWeAre.image,
          currentFile: file,
        });
        updateDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateDto.image = uploadedFiles[0];
      }
    }

    Object.assign(whoWeAre, updateDto);
    return this.whoWeAreRepo.save(whoWeAre);
  }

  /**
   * Soft Delete WhoWeAre Entry (WITH IMAGE DELETE)
   */
  async remove(id: string): Promise<void> {
    const whoWeAre = await this.whoWeAreRepo.findOne({ where: { id } });
    if (!whoWeAre) throw new NotFoundException('WhoWeAre entry not found.');

    if (whoWeAre.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(whoWeAre.image);
      } catch (err) {
        console.warn(`Failed to delete WhoWeAre image: ${err.message}`);
      }
    }

    const result = await this.whoWeAreRepo.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
