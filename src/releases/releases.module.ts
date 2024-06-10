import { Module } from '@nestjs/common';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Track} from "../tracks/tracks.model";
import {Artist} from "../artists/artists.model";
import {ReleaseArtists} from "./release-artists.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Track, ReleaseArtists, Artist]),
  ],
  controllers: [ReleasesController],
  providers: [ReleasesService]
})
export class ReleasesModule {}
