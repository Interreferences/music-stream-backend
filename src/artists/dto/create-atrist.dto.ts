import {IsOptional, IsString, Length} from "class-validator";
export class CreateAtristDto {
    @IsString({ message: 'Псевдоним должен быть строкой' })
    @Length(3, 60, { message: 'Псевдоним должен содержать не менее 3 и не более 60 символов' })
    readonly name: string;

    @IsOptional()
    @IsString({ message: 'Биография должна быть строкой' })
    readonly Bio?: string; // Поменяли bio на Bio
}