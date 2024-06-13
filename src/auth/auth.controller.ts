import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {LoginDto} from "../users/dto/login.dto";
import {Roles} from "./roles-auth.decorator";
import {RolesGuard} from "./roles.guard";

@Controller('api/auth')
export class AuthController {


    constructor(private authService: AuthService) {}
    @Post('/login')
    login(@Body() userDto: LoginDto){
        return this.authService.login(userDto);
    }

    @Post('/registration')
    registration(@Body() userDto: CreateUserDto){
        return this.authService.registration(userDto);
    }

    @Post('/admin-registration')
    adminRegistration(@Body() userDto: CreateUserDto){
        return this.authService.adminRegistration(userDto);
    }

}
