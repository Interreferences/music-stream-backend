import { Injectable } from '@nestjs/common';
import {PlaylistTypeDto} from "./dto/playlist-type.dto";
import {InjectModel} from "@nestjs/sequelize";
import {PlaylistType} from "./playlist-type.model";

@Injectable()
export class PlaylistTypeService {

    constructor(@InjectModel(PlaylistType) private playlistTypeRepository: typeof PlaylistType) {}

    async createPlaylistType(dto: PlaylistTypeDto) {
        return this.playlistTypeRepository.create(dto);
    }

    async getPlaylistTypeByValue(title: string) {
        return this.playlistTypeRepository.findOne({where:{title}});
    }
}
