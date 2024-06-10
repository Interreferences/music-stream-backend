import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAtristDto } from './dto/create-atrist.dto';
import { Artist } from './artists.model';
import { UpdateAtristDto } from './dto/update-atrist.dto';
import { Op } from 'sequelize';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectModel(Artist) private artistRepository: typeof Artist,
        private fileService: FileService
    ) {}

    async createArtist(dto: CreateAtristDto, avatar, banner) {
        const avatarPath = await this.fileService.createFile(FileType.IMAGE, avatar);
        const bannerPath = await this.fileService.createFile(FileType.IMAGE, banner);
        const artist = await this.artistRepository.create({ ...dto, avatar: avatarPath, banner: bannerPath });
        return artist;
    }

    async findAllArtists() {
        return await this.artistRepository.findAll();
    }

    async findArtistById(id: number) {
        const artist = await this.artistRepository.findByPk(id);
        if (!artist) {
            throw new NotFoundException('Артист не найден');
        }
        return artist;
    }

    async updateArtist(id: number, updateArtistDto: UpdateAtristDto, avatar, banner) {
        const artist = await this.artistRepository.findByPk(id);
        if (!artist) {
            throw new NotFoundException('Артист не найден');
        }

        let avatarPath = artist.avatar;
        let bannerPath = artist.banner;

        if (avatar) {
            this.fileService.removeFile(artist.avatar);
            avatarPath = await this.fileService.createFile(FileType.IMAGE, avatar);
        }

        if (banner) {
            this.fileService.removeFile(artist.banner);
            bannerPath = await this.fileService.createFile(FileType.IMAGE, banner);
        }

        const updatedArtist = {
            ...updateArtistDto,
            avatar: avatarPath,
            banner: bannerPath,
        };

        return await artist.update(updatedArtist);
    }

    async deleteArtist(id: number) {
        const artist = await this.artistRepository.findByPk(id);
        if (artist) {
            this.fileService.removeFile(artist.avatar);
            this.fileService.removeFile(artist.banner);
            await artist.destroy();
        }
        return artist;
    }

    async findArtistByName(name: string) {
        const artists = await this.artistRepository.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        });
        if (!artists.length) {
            throw new NotFoundException(`Артисты по запросу: "${name}" не найдены`);
        }
        return artists;
    }
}
