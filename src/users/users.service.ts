import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { Role } from '../roles/roles.model';
import {RolesService} from "../roles/roles.service";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService) {}


    async createUser(dto: CreateUserDto) {
        const role = await this.roleService.getRoleByValue("Admin");
        if (!role) {
            throw new HttpException('Роль "User" не найдена', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const user = await this.userRepository.create({
            ...dto,
            roleId: role.id // присваиваем роль пользователю
        });

        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll({ include: [Role] });
    }

    async getUserByLogin(login: string): Promise<User> {
        return this.userRepository.findOne({ where: { login }, include: [Role] });
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
