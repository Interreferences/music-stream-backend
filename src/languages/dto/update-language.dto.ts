import { IsString, Length } from "class-validator";

export class UpdateLanguageDto {
    @IsString({ message: 'Название должно быть строкой' })
    @Length(2, 40, { message: 'Название должно содержать не менее 2 и не более 40 символов' })
    readonly name: string;
}