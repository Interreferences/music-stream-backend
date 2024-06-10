import { Module } from '@nestjs/common';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Language} from "./languages.model";
import {Track} from "../tracks/tracks.model";
import {TrackArtists} from "../tracks/track-artists.model";

@Module({
  imports: [SequelizeModule.forFeature([Language, Track, TrackArtists])],
  controllers: [LanguagesController],
  providers: [LanguagesService]
})
export class LanguagesModule {}