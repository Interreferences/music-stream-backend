import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {PlaylistTypeService} from "./playlist-type.service";
import {PlaylistTypeDto} from "./dto/playlist-type.dto";

@Controller('api/playlist-type')
export class PlaylistTypeController {

    constructor(private playlistTypeService: PlaylistTypeService) {}

    @Post()
    async create(@Body() dto:PlaylistTypeDto){
        return this.playlistTypeService.createPlaylistType(dto);
    }


    @Get('/:title')
    async getByValue(@Param('title') title: string) {
        return this.playlistTypeService.getPlaylistTypeByValue(title);
    }

}
