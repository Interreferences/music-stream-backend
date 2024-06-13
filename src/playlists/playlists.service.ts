import {Injectable, NotFoundException} from '@nestjs/common';
import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {Playlist} from "./playlists.model";
import {InjectModel} from "@nestjs/sequelize";
import {FileService, FileType} from "../file/file.service";
import {PlaylistTypeService} from "../playlist-type/playlist-type.service";
import {AddTrackToPlaylistDto} from "./dto/add-track-to-playlist.dto";
import {PlaylistTracks} from "./playlist-tracks.model";
import {Track} from "../tracks/tracks.model";
import {UpdatePlaylistDto} from "./dto/update-playlist.dto";
import {User} from "../users/users.model";
import {PlaylistType} from "../playlist-type/playlist-type.model";
import {Op} from "sequelize";

@Injectable()
export class PlaylistsService {

    constructor(
        @InjectModel (Playlist) private playlistRepository: typeof Playlist,
        @InjectModel (PlaylistTracks) private playlistTracksRepository: typeof PlaylistTracks,
        @InjectModel (Track) private tracksRepository: typeof Track,
        private fileService: FileService,
        private playlistTypeService: PlaylistTypeService,
    ) {}

    async createPlaylist(createPlaylistDto: CreatePlaylistDto, cover) {
        let coverPath;
        if (cover) {
            coverPath = await this.fileService.createFile(FileType.IMAGE, cover);
        } else {
            coverPath = 'path/to/default/cover/image.png';  // путь к стандартному изображению
        }

        // Получаем playlistType по значению title
        const playlistType = await this.playlistTypeService.getPlaylistTypeByValue('Плейлист');  // Замените 'default' на нужное значение

        const playlist = await this.playlistRepository.create({
            ...createPlaylistDto,
            cover: coverPath,
            playlistTypeId: playlistType.id  // Присваиваем id из ReleaseType
        });

        return playlist;
    }


    async createMediaLibraryPlaylist(createPlaylistDto: CreatePlaylistDto) {

        const MEDIA_LIBRARY_COVER_PATH = "image/library.jpg"

        const playlistType = await this.playlistTypeService.getPlaylistTypeByValue('Медиатека');

        const playlist = await this.playlistRepository.create({
            ...createPlaylistDto,
            cover: MEDIA_LIBRARY_COVER_PATH,
            playlistTypeId: playlistType.id, // Присваиваем id из ReleaseType
        });

        return playlist;
    }

    async addTrackToPlaylist(addTrackToPlaylistDto: AddTrackToPlaylistDto) {
        // Optionally, you can validate the existence of the playlist and track
        const playlist = await this.playlistRepository.findByPk(addTrackToPlaylistDto.playlistId);
        if (!playlist) {
            throw new Error(`Playlist with ID ${addTrackToPlaylistDto.playlistId} not found`);
        }

        const track = await this.tracksRepository.findByPk(addTrackToPlaylistDto.trackId);
        if (!track) {
            throw new Error(`Track with ID ${addTrackToPlaylistDto.trackId} not found`);
        }

        const playlistTrack = await this.playlistTracksRepository.create({
            playlistId: addTrackToPlaylistDto.playlistId,
            trackId: addTrackToPlaylistDto.trackId,
        });

        return playlistTrack;
    }

    async removeTrackFromPlaylist(playlistId: number, trackId: number) {
        // Validate the existence of the playlist
        const playlist = await this.playlistRepository.findByPk(playlistId);
        if (!playlist) {
            throw new NotFoundException(`Playlist with ID ${playlistId} not found`);
        }

        // Validate the existence of the track
        const track = await this.tracksRepository.findByPk(trackId);
        if (!track) {
            throw new NotFoundException(`Track with ID ${trackId} not found`);
        }

        // Find and delete the playlistTrack
        const playlistTrack = await this.playlistTracksRepository.findOne({
            where: {
                playlistId,
                trackId,
            },
        });

        if (!playlistTrack) {
            throw new NotFoundException(`Track with ID ${trackId} not found in Playlist with ID ${playlistId}`);
        }

        await playlistTrack.destroy();
        return { message: 'Track removed from playlist successfully' };
    }

    async findPlaylistById(id: number) {
        const playlist = await this.playlistRepository.findByPk(id,{
           include: [
               {
                   model: Track,
                   through: { attributes: [] },
               },
               {
                   model: User,
                   attributes: ['id', 'login', 'nickname'],
               },
               {
                   model: PlaylistType,
                   attributes: ['title'],
               }
           ]
        });
        return playlist;
    }

    async findAllPlaylists() {
        return await this.playlistRepository.findAll();
    }

    async updatePlaylist(id: number, updatePlaylistDto: UpdatePlaylistDto, cover?: any) {
        const playlist = await this.playlistRepository.findByPk(id);
        if (!playlist) {
            throw new NotFoundException('Playlist not found');
        }

        if (cover) {
            if (playlist.cover !== 'path/to/default/cover/image.png') {
                await this.fileService.removeFile(playlist.cover);
            }
            const coverPath = await this.fileService.createFile(FileType.IMAGE, cover);
            playlist.cover = coverPath;
        }

        await playlist.update(updatePlaylistDto);
        return playlist;
    }

    async deletePlaylist(id: number) {
        const playlist = await this.playlistRepository.findByPk(id);
        if (!playlist) {
            throw new NotFoundException(`Playlist with ID ${id} not found`);
        }

        if (playlist.cover !== 'path/to/default/cover/image.png') {
            await this.fileService.removeFile(playlist.cover);
        }

        await playlist.destroy();
        return { message: 'Playlist deleted successfully' };
    }

    async adminFindPlaylistByTitle(title: string) {
        const playlists = await this.playlistRepository.findAll({
            where: {
                title: {
                    [Op.iLike]: `%{title}%`
                }
            },
            include: [
                {
                    model: PlaylistType,
                    through: { attributes: [] },
                },
                {
                    model: User,
                    through: { attributes: [] },
                },
            ],
        });
        if (!playlists.length) {
            throw new NotFoundException(`Плейлисты по запросу: "${title}" не найдены`)
        }
        return playlists;
    }

    async userFindPlaylistByTitle(title: string) {
        const playlists = await this.playlistRepository.findAll({
            where: {
                title: {
                    [Op.iLike]: `%{title}%`
                },
                public: true
            },
            include: [
                {
                    model: PlaylistType,
                    through: { attributes: [] },
                },
                {
                    model: User,
                    through: { attributes: [] },
                },
            ],
        });
        if (!playlists.length) {
            throw new NotFoundException(`Плейлисты по запросу: "${title}" не найдены`)
        }
        return playlists;
    }


}
