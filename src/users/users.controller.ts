import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";

@Controller('users')
export class UsersController {

    constructor(private UsersService: UsersService) {}

    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.UsersService.CreateUser(userDto);

    }


    // @UseGuards(JwtAuthGuard)
    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.UsersService.GetAllUsers();
    }


    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.UsersService.addRole(dto);
    }

    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Post('/ban')
    ban(@Body() dto: BanUserDto) {
        return this.UsersService.ban(dto);
    }

}
