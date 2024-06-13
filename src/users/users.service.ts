import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { Role } from '../roles/roles.model';
import {RolesService} from "../roles/roles.service";
import {PlaylistsService} from "../playlists/playlists.service";
import {CreatePlaylistDto} from "../playlists/dto/create-playlist.dto";
import {Playlist} from "../playlists/playlists.model";
import {PlaylistType} from "../playlist-type/playlist-type.model";

@Injectable()
export class UsersService {



    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService,
                private playlistsService: PlaylistsService) {}

    async createUser(dto: CreateUserDto) {
        const role = await this.roleService.getRoleByValue('User');

        if (!role) {
            throw new HttpException('Роль "User" не найдена', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const user = await this.userRepository.create({
            ...dto,
            roleId: role.id,
        });

        // Создаем медиатеку для нового пользователя
        const createPlaylistDto: CreatePlaylistDto = {
            title: 'Медиатека',
            public: false,
            userId: user.id,
        };
        await this.playlistsService.createMediaLibraryPlaylist(createPlaylistDto);

        // Возвращаем пользователя с включенными ролями и плейлистами
        return this.userRepository.findByPk(user.id, {
            include: [
                Role, // Включаем модель Role
                {
                    model: Playlist, // Включаем модель Playlist
                    attributes: ['id', 'title', 'playlistTypeId', 'cover'],
                    include: [
                        {
                            model: PlaylistType,
                            attributes: ['id', 'title'],
                        }
                    ],
                },
            ],
        });
    }

    async createAdmin(dto: CreateUserDto) {
        const role = await this.roleService.getRoleByValue('Admin');

        if (!role) {
            throw new HttpException('Роль "Admin" не найдена', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const user = await this.userRepository.create({
            ...dto,
            roleId: role.id,
        });

        // Создаем медиатеку для нового пользователя
        const createPlaylistDto: CreatePlaylistDto = {
            title: 'Медиатека',
            public: false,
            userId: user.id,
        };
        await this.playlistsService.createMediaLibraryPlaylist(createPlaylistDto);

        // Возвращаем пользователя с включенными ролями и плейлистами
        return this.userRepository.findByPk(user.id, {
            include: [
                Role, // Включаем модель Role
                {
                    model: Playlist, // Включаем модель Playlist
                    attributes: ['id', 'title', 'playlistTypeId', 'cover'],
                    include: [
                        {
                            model: PlaylistType,
                            attributes: ['id', 'title'],
                        }
                    ],
                },
            ],
        });
    }


    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll({
                include: [
                    Role, // Включаем модель Role
                ],
            });
    }

    async getUserByLogin(login: string): Promise<User> {
        return this.userRepository.findOne({
            where: { login },
            include: [
                Role, // Включаем модель Role
                {
                    model: Playlist, // Включаем модель Playlist
                    attributes: ['id', 'title', 'playlistTypeId', 'cover'],
                    include: [
                        {
                            model: PlaylistType,
                            attributes: ['id', 'title'],
                        }
                    ],
                },
            ],
        });
    }

    async ban(dto: BanUserDto): Promise<User> {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.bannedReason = dto.banReason;
        await user.save();
        return user;
    }
}
