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

@Module({
    controllers: [],
    providers: [],
    imports: [
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
            models: [User, Role, Genres, Label],
            autoLoadModels: true,
            synchronize: true, // синхронизация моделей с таблицами
            sync: { alter: true },
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        GenresModule,
        LabelsModule,
    ],
})
export class AppModule {}