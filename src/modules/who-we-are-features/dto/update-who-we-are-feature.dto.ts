import { PartialType } from '@nestjs/swagger';
import { CreateWhoWeAreFeatureDto } from './create-who-we-are-feature.dto';

export class UpdateWhoWeAreFeatureDto extends PartialType(CreateWhoWeAreFeatureDto) {}
