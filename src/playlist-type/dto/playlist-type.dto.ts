import { IsString, Length } from "class-validator";

export class PlaylistTypeDto {
    @IsString({ message: 'Значение должно быть строкой' })
    @Length(2, 40, { message: 'Значение должно содержать не менее 3 и не более 40 символов' })
    readonly title: string;
}