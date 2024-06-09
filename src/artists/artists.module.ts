import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Artist} from "./artists.model";
import {FileService} from "../file/file.service";


@Module({
  imports: [
      SequelizeModule.forFeature([Artist]),

  ],
  controllers: [ArtistsController],
  providers: [ArtistsService, FileService]
})
export class ArtistsModule {}
