import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users.model";
import { Role } from "../roles/roles.model";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";
import {Track} from "../tracks/tracks.model";
import {Playlist} from "../playlists/playlists.model";
import {PlaylistsService} from "../playlists/playlists.service";
import {PlaylistsModule} from "../playlists/playlists.module";
import {FileService} from "../file/file.service";
import {PlaylistTypeModule} from "../playlist-type/playlist-type.module";

@Module({
    controllers: [UsersController],
    providers: [UsersService, PlaylistsService, FileService],
    imports: [
        SequelizeModule.forFeature([User, Role, Track, Playlist]),
        RolesModule,
        forwardRef(() => AuthModule),
        PlaylistsModule,
        PlaylistTypeModule,
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule {}