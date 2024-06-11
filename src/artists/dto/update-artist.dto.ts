import {IsOptional, IsString, Length, IsArray, ValidateNested, IsNumber} from 'class-validator';
import {Transform, Type} from 'class-transformer'
class SocialDto {
    @IsNumber({}, { message: 'Id соц.сети должно быть числом' })
    @Transform(({ value }) => Number(value))
    readonly socialId: number;

    @IsString({ message: 'Название социальной сети должно быть строкой' })
    readonly title: string;

    @IsString({ message: 'Ссылка на социальную сеть должна быть строкой' })
    readonly link: string;
}

export class UpdateArtistDto {
    @IsOptional()
    @IsString({ message: 'Псевдоним должен быть строкой' })
    @Length(3, 60, { message: 'Псевдоним должен содержать не менее 3 и не более 60 символов' })
    readonly name?: string;

    @IsOptional()
    @IsString({ message: 'Биография должна быть строкой' })
    readonly bio?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SocialDto)
    readonly socials?: SocialDto[];
}