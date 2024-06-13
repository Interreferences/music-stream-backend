import {
    Body,
    Controller, Delete,
    Get,
    HttpException,
    HttpStatus, NotFoundException,
    Param, ParseIntPipe, Patch,
    Post,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import {PlaylistsService} from "./playlists.service";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {AddTrackToPlaylistDto} from "./dto/add-track-to-playlist.dto";
import {UpdatePlaylistDto} from "./dto/update-playlist.dto";

@Controller('api/playlists')
export class PlaylistsController {

    constructor(private readonly playlistsService: PlaylistsService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'cover', maxCount: 1 },
    ]))
    async create(@UploadedFiles() files, @Body() createPlaylistDto: CreatePlaylistDto) {
        const {cover} = files || {};
        return this.playlistsService.createPlaylist(createPlaylistDto, cover ? cover[0] : null);
    }

    @Post('add-track')
    async addTrackToPlaylist(@Body() addTrackToPlaylistDto: AddTrackToPlaylistDto) {
        try {
            const playlistTrack = await this.playlistsService.addTrackToPlaylist(addTrackToPlaylistDto);
            return playlistTrack;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':playlistId/tracks/:trackId')
    async removeTrackFromPlaylist(
        @Param('playlistId', ParseIntPipe) playlistId: number,
        @Param('trackId', ParseIntPipe) trackId: number
    ) {
        return await this.playlistsService.removeTrackFromPlaylist(playlistId, trackId);
    }

    @Get(':id')
    async getPlaylistById(@Param('id') id: number) {
        return this.playlistsService.findPlaylistById(id);
    }

    @Get()
    async findAll() {
        return this.playlistsService.findAllPlaylists();
    }

    @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'cover', maxCount: 1 },
    ]))
    async update(@Param('id') id: number, @UploadedFiles() files, @Body() updatePlaylistDto: UpdatePlaylistDto) {
        const {cover} = files || {};
        return this.playlistsService.updatePlaylist(id, updatePlaylistDto, cover ? cover[0] : null);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.playlistsService.deletePlaylist(id);
        return {message: 'Плейлист успешно удален'};
    }

    @Get('search-admin/:title')
    async adminFindPlaylistByTitle(@Param('title') title: string) {
        try {
            return await this.playlistsService.adminFindPlaylistByTitle(title);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            throw error
        }
    }

    @Get('search-user/:title')
    async userFindPlaylistByTitle(@Param('title') title: string) {
        try {
            return await this.playlistsService.userFindPlaylistByTitle(title);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            throw error
        }
    }


}
