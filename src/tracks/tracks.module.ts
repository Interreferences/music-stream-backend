import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Track} from "./tracks.model";
import {TrackArtists} from "./track-artists.model";
import {Artist} from "../artists/artists.model";
import {FileService} from "../file/file.service";
import {Language} from "../languages/languages.model";
import {TrackLanguages} from "./track-languages.model";
import {Release} from "../releases/releases.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Track, TrackArtists, Artist, TrackLanguages, Language, Release]),
  ],
  controllers: [TracksController],
  providers: [TracksService, FileService]
})
export class TracksModule {}
