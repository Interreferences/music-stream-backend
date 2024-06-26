import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { User } from "../users/users.model";
import {LoginDto} from "../users/dto/login.dto";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService,
                ) {}

    async onModuleInit() {
        const adminLogin = 'music-stream-admin';
        const adminUser = await this.userService.getUserByLogin(adminLogin);

        if (!adminUser) {
            const defaultUserDto: CreateUserDto = {
                login: adminLogin,
                nickname: 'Administrator',
                password: 'password123',
            };
            await this.adminRegistration(defaultUserDto);
        }
    }

    async login(userDto: LoginDto){
        const user = await this.validateUser(userDto);
        return this.generateAuthResponse(user);
    }

    async registration(userDto: CreateUserDto){
        const candidate = await this.userService.getUserByLogin(userDto.login);
        if (candidate) {
            throw new HttpException('Пользователь с таким логином уже существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword})

        return this.generateAuthResponse(user);
    }

    async adminRegistration(userDto: CreateUserDto){
        const candidate = await this.userService.getUserByLogin(userDto.login);
        if (candidate) {
            throw new HttpException('Пользователь с таким логином уже существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createAdmin({...userDto, password: hashPassword})

        return this.generateAuthResponse(user);
    }



    private async generateAuthResponse(user: User) {
        const payload = { login: user.login, id: user.id, nickname: user.nickname, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            token,
            user: {
                id: user.id,
                login: user.login,
                nickname: user.nickname,
                role: user.role.value,
                banned: user.banned,
                bannedReason: user.bannedReason,
                playlists: user.playlists,
            }
        };
    }

    private async validateUser(userDto: LoginDto) {
        const user = await this.userService.getUserByLogin(userDto.login);
        if (user && await bcrypt.compare(userDto.password, user.password)) {
            return user;
        }
        throw new UnauthorizedException({message: 'Неверный логин или пароль'});
    }
}
