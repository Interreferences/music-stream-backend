import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.model";
import { Genres } from "./genres/genres.model";
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { AuthModule } from './auth/auth.module';
import { GenresModule } from './genres/genres.module';
import { LabelsModule } from './labels/labels.module';
import {Label} from "./labels/label.model";
import { ArtistsModule } from './artists/artists.module';
import {Artist} from "./artists/artists.model";
import { FileModule } from './file/file.module';
import * as path from 'path'
import {ServeStaticModule} from "@nestjs/serve-static";
import { LanguagesModule } from './languages/languages.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, Genres, Label, Artist],
            autoLoadModels: true,
            synchronize: true, // синхронизация моделей с таблицами
            sync: { alter: true },
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        GenresModule,
        LabelsModule,
        ArtistsModule,
        FileModule,
        LanguagesModule,
    ],
})
export class AppModule {}