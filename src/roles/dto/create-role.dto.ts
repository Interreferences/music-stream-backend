import { IsString, Length } from "class-validator";

export class CreateRoleDto {
    @IsString({ message: 'Значение должно быть строкой' })
    @Length(3, 40, { message: 'Значение должно содержать не менее 3 и не более 40 символов' })
    readonly value: string;

    @IsString({ message: 'Описание должно быть строкой' })
    @Length(4, 60, { message: 'Описание должно содержать не менее 4 и не более 60 символов' })
    readonly description: string;
}