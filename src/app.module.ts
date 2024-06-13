import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.model";
import { Genres } from "./genres/genres.model";
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { GenresModule } from './genres/genres.module';
import { LabelsModule } from './labels/labels.module';
import {Label} from "./labels/label.model";
import { ArtistsModule } from './artists/artists.module';
import {Artist} from "./artists/artists.model";
import { FileModule } from './file/file.module';
import * as path from 'path'
import {ServeStaticModule} from "@nestjs/serve-static";
import { LanguagesModule } from './languages/languages.module';
import { TracksModule } from './tracks/tracks.module';
import { ReleasesModule } from './releases/releases.module';
import {Track} from "./tracks/tracks.model";
import {Release} from "./releases/releases.model";
import {TrackArtists} from "./tracks/track-artists.model";
import {Language} from "./languages/languages.model";
import {ReleaseArtists} from "./releases/release-artists.model";
import {TrackLanguages} from "./tracks/track-languages.model";
import { ReleaseTypeModule } from './release-type/release-type.module';
import {ReleaseType} from "./release-type/release-type.model";
import {ReleaseLabels} from "./releases/release-labels.model";
import { SocialsModule } from './socials/socials.module';
import { AuthModule } from './auth/auth.module';
import {Social} from "./socials/socials.model";
import {ArtistSocials} from "./artists/artist-socials.model";
import { PlaylistTypeModule } from './playlist-type/playlist-type.module';
import {PlaylistType} from "./playlist-type/playlist-type.model";
import { PlaylistsModule } from './playlists/playlists.module';
import {Playlist} from "./playlists/playlists.model";
import {PlaylistTracks} from "./playlists/playlist-tracks.model";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
            isGlobal: true,
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [
                User,
                Role,
                Genres,
                Label,
                Artist,
                Track,
                Release,
                TrackArtists,
                ReleaseArtists,
                ReleaseLabels,
                Language,
                TrackLanguages,
                ReleaseType,
                Social,
                ArtistSocials,
                PlaylistType,
                Playlist,
                PlaylistTracks],
            autoLoadModels: true,
            synchronize: true, // синхронизация моделей с таблицами
            sync: { alter: true },
        }),
        RolesModule,
        GenresModule,
        LabelsModule,
        ArtistsModule,
        FileModule,
        LanguagesModule,
        TracksModule,
        ReleasesModule,
        ReleaseTypeModule,
        SocialsModule,
        PlaylistTypeModule,
        PlaylistsModule,
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {}