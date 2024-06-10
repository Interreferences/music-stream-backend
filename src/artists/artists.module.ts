import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Artist} from "./artists.model";
import {FileService} from "../file/file.service";
import {Track} from "../tracks/tracks.model";
import {TrackArtists} from "../tracks/track-artists.model";


@Module({
  imports: [
      SequelizeModule.forFeature([Artist, Track, TrackArtists]),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService, FileService]
})
export class ArtistsModule {}
