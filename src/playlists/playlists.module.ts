import { Module } from '@nestjs/common';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Playlist} from "./playlists.model";
import {PlaylistTracks} from "./playlist-tracks.model";
import {User} from "../users/users.model";
import {Track} from "../tracks/tracks.model";
import {FileService} from "../file/file.service";
import {PlaylistTypeService} from "../playlist-type/playlist-type.service";
import {PlaylistType} from "../playlist-type/playlist-type.model";

@Module({
  imports: [
      SequelizeModule.forFeature([Playlist, PlaylistTracks, User, Track, PlaylistType])
  ],
  controllers: [PlaylistsController],
  providers: [PlaylistsService, FileService, PlaylistTypeService],
    exports: [
        PlaylistsService, // Экспортируйте PlaylistsService
        SequelizeModule.forFeature([PlaylistTracks]), // Экспортируйте PlaylistTracks
    ]
})
export class PlaylistsModule {}
