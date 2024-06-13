import { IsString, Length, IsNumber } from "class-validator";

export class LoginDto {
    @IsString({ message: 'Логин должен быть строкой' })
    @Length(3, 20, { message: 'Логин должен содержать не менее 3 и не более 20 символов' })
    readonly login: string;

    @IsString({ message: 'Пароль должен быть строкой' })
    @Length(6, 40, { message: 'Пароль должен содержать не менее 6 и не более 40 символов' })
    readonly password: string;
}