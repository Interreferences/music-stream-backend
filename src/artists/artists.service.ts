import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {CreateArtistDto} from './dto/create-artist.dto';
import { Artist } from './artists.model';
import {UpdateArtistDto} from './dto/update-artist.dto';
import { Op } from 'sequelize';
import { FileService, FileType } from '../file/file.service';
import {ArtistSocials} from "./artist-socials.model";
import {Social} from "../socials/socials.model";
import {Track} from "../tracks/tracks.model";
import {Release} from "../releases/releases.model";
import {ReleaseType} from "../release-type/release-type.model";
import {TrackArtists} from "../tracks/track-artists.model";
import {ReleaseArtists} from "../releases/release-artists.model";

@Injectable()
export class ArtistsService {
    constructor(
        @InjectModel(Artist) private artistRepository: typeof Artist,
        @InjectModel(ArtistSocials) private artistSocialsRepository: typeof ArtistSocials,
        @InjectModel(Social) private socialRepository: typeof Social,
        @InjectModel(TrackArtists) private trackArtistsRepository: typeof TrackArtists,
        @InjectModel(ReleaseArtists) private releaseArtistsRepository: typeof ReleaseArtists,
        private fileService: FileService
    ) {}

    async createArtist(dto: CreateArtistDto, avatar, banner) {
        const avatarPath = await this.fileService.createFile(FileType.IMAGE, avatar);
        const bannerPath = await this.fileService.createFile(FileType.IMAGE, banner);

        // Создаем артиста в базе данных
        const artist = await this.artistRepository.create({
            ...dto,
            avatar: avatarPath,
            banner: bannerPath
        });

        // Если переданы социальные сети, создаем записи о них в базе данных
        if (dto.socials && dto.socials.length > 0) {
            await Promise.all(dto.socials.map(async (social) => {
                const socialRecord = await this.socialRepository.findByPk(social.socialId);
                if (socialRecord) {
                    await this.artistSocialsRepository.create({
                        artistId: artist.id,
                        socialId: socialRecord.id,
                        title: social.title,
                        link: social.link
                    });
                }
            }));
        }

        return artist;
    }



    async findAllArtists() {
        return await this.artistRepository.findAll();
    }

    async findArtistById(id: number) {
        const artist = await this.artistRepository.findByPk(id, {
            include: [
                {
                    model: Social,
                    attributes: ['id', 'title'],
                },
                {
                    model: Track,
                    through: { attributes: [] },
                },
                {
                    model: Release,
                    through: { attributes: [] },
                },
            ]
        });
        if (!artist) {
            throw new NotFoundException('Артист не найден');
        }
        return artist;
    }

    async updateArtist(id: number, updateArtistDto: UpdateArtistDto, avatar, banner) {
        const artist = await this.artistRepository.findByPk(id);
        if (!artist) {
            throw new NotFoundException('Артист не найден');
        }

        if (avatar) {
            await this.fileService.removeFile(artist.avatar);
            const avatarPath = await this.fileService.createFile(FileType.IMAGE, avatar);
            artist.avatar = avatarPath;
        }

        if (banner) {
            await this.fileService.removeFile(artist.banner);
            const bannerPath = await this.fileService.createFile(FileType.IMAGE, banner);
            artist.banner = bannerPath;
        }

        if (updateArtistDto.socials && updateArtistDto.socials.length > 0) {
            // Удаляем старые социальные сети
            await this.artistSocialsRepository.destroy({ where: { artistId: id } });
            // Создаем новые социальные сети
            await Promise.all(updateArtistDto.socials.map(async (social) => {
                await this.artistSocialsRepository.create({
                    artistId: id,
                    title: social.title,
                    link: social.link
                });
            }));
        }

        await artist.save();

        return this.findArtistById(id);
    }

    async deleteArtist(id: number) {
        const artist = await this.artistRepository.findByPk(id);
        if (artist) {
            this.fileService.removeFile(artist.avatar);
            this.fileService.removeFile(artist.banner);

            await this.artistSocialsRepository.destroy({ where: { artistId: id } });
            await this.trackArtistsRepository.destroy({ where: { artistId: id } });
            await this.releaseArtistsRepository.destroy({ where: { artistId: id } });


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
