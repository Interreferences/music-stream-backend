import {IsBoolean, IsNumber, IsOptional, IsString, Length} from "class-validator";
import {Transform} from "class-transformer";

export class CreatePlaylistDto {

    @IsString({message: 'Название должно быть строкой'})
    @Length(1,30, {message: 'Название должно содержать не менее 1 и не более 30 символов'})
    readonly title: string;

    @IsBoolean({ message: 'Поле "public" должно быть булевым значением' })
    @Transform(({ value }) => value === 'true' || value === true)
    readonly public: boolean;

    @IsOptional()
    @IsString({ message: 'Описание должно быть строкой' })
    readonly description?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Id жанра должно быть числом' })
    @Transform(({ value }) => Number(value))
    userId?: number;
}