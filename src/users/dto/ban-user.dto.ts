import { IsNumber, IsString, Length } from "class-validator";

export class BanUserDto {
    @IsNumber({}, { message: 'ID пользователя должно быть числом' })
    readonly userId: number;

    @IsString({ message: 'Причина блокировки должна быть строкой' })
    @Length(1, 60, { message: 'Причина блокировки должна содержать не менее 1 и не более 60 символов' })
    readonly banReason: string;
}