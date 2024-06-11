import { Module } from '@nestjs/common';
import { SocialsController } from './socials.controller';
import { SocialsService } from './socials.service';
import {Artist} from "../artists/artists.model";
import {Social} from "./socials.model";
import {ArtistSocials} from "../artists/artist-socials.model";
import {SequelizeModule} from "@nestjs/sequelize";

@Module({
  imports: [
    SequelizeModule.forFeature([Social, Artist, ArtistSocials]),
  ],
  controllers: [SocialsController],
  providers: [SocialsService]
})
export class SocialsModule {}
