import { Module } from '@nestjs/common';
import { PlaylistTypeController } from './playlist-type.controller';
import { PlaylistTypeService } from './playlist-type.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {PlaylistType} from "./playlist-type.model";

@Module({
  imports: [
    SequelizeModule.forFeature([PlaylistType])
  ],
  controllers: [PlaylistTypeController],
  providers: [PlaylistTypeService],
  exports: [PlaylistTypeService],
})
export class PlaylistTypeModule {}
