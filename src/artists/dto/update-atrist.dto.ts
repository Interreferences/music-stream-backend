import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateAtristDto {
    @IsOptional()
    @IsString({ message: 'Псевдоним должен быть строкой' })
    @Length(3, 60, { message: 'Псевдоним должен содержать не менее 3 и не более 60 символов' })
    readonly name?: string;

    @IsOptional()
    @IsString({ message: 'Путь к аватару должен быть строкой' })
    readonly avatar?: string;

    @IsOptional()
    @IsString({ message: 'Путь к баннеру должен быть строкой' })
    readonly banner?: string;
}
