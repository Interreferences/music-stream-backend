import { IsString, Length } from "class-validator";

export class CreateRoleDto {
    @IsString({ message: 'Значение должно быть строкой' })
    @Length(3, 40, { message: 'Значение должно содержать не менее 3 и не более 40 символов' })
    readonly value: string;
}