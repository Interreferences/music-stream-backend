import {IsBoolean, IsNumber, IsOptional, IsString, Length} from "class-validator";
import {Transform} from "class-transformer";


export class AddTrackToPlaylistDto {

    @IsNumber({}, { message: 'Id жанра должно быть числом' })
    @Transform(({ value }) => Number(value))
    playlistId: number;

    @IsNumber({}, { message: 'Id жанра должно быть числом' })
    @Transform(({ value }) => Number(value))
    trackId: number;

}