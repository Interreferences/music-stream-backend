import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Artist} from "./artists.model";
import {FileService} from "../file/file.service";
import {Track} from "../tracks/tracks.model";
import {TrackArtists} from "../tracks/track-artists.model";
import {Release} from "../releases/releases.model";
import {ReleaseArtists} from "../releases/release-artists.model";
import {Social} from "../socials/socials.model";
import {ArtistSocials} from "./artist-socials.model";
import {SocialsService} from "../socials/socials.service";

@Module({
  imports: [
      SequelizeModule.forFeature([Artist, Release, ReleaseArtists, Track, TrackArtists, Social, ArtistSocials]),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService, FileService, SocialsService]
})
export class ArtistsModule {}
