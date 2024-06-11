import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateReleaseDto} from "./dto/create-release.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Release} from "./releases.model";
import {FileService, FileType} from "../file/file.service";
import {ReleaseArtists} from "./release-artists.model";
import {ReleaseLabels} from "./release-labels.model";
import {Track} from "../tracks/tracks.model";
import {UpdateReleaseDto} from "./dto/update-release.dto";
import {ReleaseTypeService} from "../release-type/release-type.service";
import {Artist} from "../artists/artists.model";
import {Label} from "../labels/label.model";
import {Genres} from "../genres/genres.model";
import {Language} from "../languages/languages.model";
import {Op} from "sequelize";

@Injectable()
export class ReleasesService {

    constructor(
        @InjectModel(Release) private releaseRepository: typeof Release,
        @InjectModel(ReleaseArtists) private releaseArtistsRepository: typeof ReleaseArtists,
        @InjectModel(ReleaseLabels) private releaseLabelsRepository: typeof ReleaseLabels,
        @InjectModel(Track) private trackRepository: typeof Track,
        private fileService: FileService,
        private releaseTypeService: ReleaseTypeService
    ) {}

    async createRelease(createReleaseDto: CreateReleaseDto, cover) {
        const coverPath = await this.fileService.createFile(FileType.IMAGE, cover);

        // Определяем значение поля published на основе даты релиза
        const releaseDate = new Date(createReleaseDto.releaseDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Обнуляем время для точного сравнения

        let published = false;
        if (releaseDate <= today) {
            published = true;
        }

        // Получаем количество треков
        const trackCount = createReleaseDto.trackIds.length;

        // Получаем идентификаторы типов релизов
        const allReleaseTypes = await this.releaseTypeService.getAllReleaseTypes();
        let releaseTypeId;
        if (trackCount === 1) {
            releaseTypeId = allReleaseTypes.find(type => type.title === 'Сингл')?.id;
        } else if (trackCount >= 2 && trackCount <= 4) {
            releaseTypeId = allReleaseTypes.find(type => type.title === 'EP')?.id;
        } else if (trackCount >= 5) {
            releaseTypeId = allReleaseTypes.find(type => type.title === 'Альбом')?.id;
        }

        const release = await this.releaseRepository.create({
            ...createReleaseDto,
            cover: coverPath,
            published: published,
            releaseType: releaseTypeId
        });

        const artistIds = createReleaseDto.artistIds;
        for (const artistId of artistIds) {
            await this.releaseArtistsRepository.create({
                releaseId: release.id,
                artistId: artistId
            });
        }

        const labelIds = createReleaseDto.labelIds;
        for (const labelId of labelIds) {
            await this.releaseLabelsRepository.create({
                releaseId: release.id,
                labelId: labelId
            });
        }

        const trackIds = createReleaseDto.trackIds;
        for (const trackId of trackIds) {
            const track = await this.trackRepository.findByPk(trackId);
            if (track) {
                track.releaseId = release.id;
                await track.save();
            }
        }

        return release;
    }

    async findAllReleases() {
        return await this.releaseRepository.findAll({
            include: [
                {
                    model: Artist,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Label,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Track,
                    attributes: ['id', 'title', 'audio', 'explicit_content', 'listens', 'releaseId', 'genreId'], // Указываем атрибуты, которые хотим получить
                    include: [
                        {
                            model: Artist,
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                        },
                        {
                            model: Genres,
                            attributes: ['id', 'name'], // Указываем атрибуты жанра, которые хотим получить
                        },
                        {
                            model: Language,
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                        }
                    ]
                },
            ],
        });
    }

    async findReleaseById(id: number) {
        const release = await this .releaseRepository.findByPk(id, {
            include: [
                {
                    model: Artist,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Label,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Track,
                    attributes: ['id', 'title', 'audio', 'explicit_content', 'listens', 'releaseId', 'genreId'], // Указываем атрибуты, которые хотим получить
                    include: [
                        {
                            model: Artist,
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                        },
                        {
                            model: Genres,
                            attributes: ['id', 'name'], // Указываем атрибуты жанра, которые хотим получить
                        },
                        {
                            model: Language,
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                        }
                    ]
                },
            ],
        });
        if (!release) {
            throw new NotFoundException('Релиз не найден');
        }
        return release;
    }

    async updateRelease(id: number, updateReleaseDto: UpdateReleaseDto, cover?: any) {
        const release = await this.releaseRepository.findByPk(id);
        if (!release) {
            throw new NotFoundException('Релиз не найден');
        }

        if (cover) {
            await this.fileService.removeFile(release.cover);
            const coverPath = await this.fileService.createFile(FileType.IMAGE, cover);
            release.cover = coverPath;
        }

        const artistIds = updateReleaseDto.artistIds;
        if (artistIds) {
            await this.releaseArtistsRepository.destroy({ where: { releaseId: id } });
            for (const artistId of artistIds) {
                await this.releaseArtistsRepository.create({ releaseId: id, artistId: artistId });
            }
        }

        const labelIds = updateReleaseDto.labelIds;
        if (labelIds) {
            await this.releaseLabelsRepository.destroy({ where: { releaseId: id } });
            for (const labelId of labelIds) {
                await this.releaseLabelsRepository.create({ releaseId: id, labelId: labelId });
            }
        }

        const trackIds = updateReleaseDto.trackIds;
        if (trackIds) {
            // Открепляем все существующие треки от релиза
            await this.trackRepository.update({ releaseId: null }, { where: { releaseId: id } });

            // Проверяем количество треков и определяем тип релиза
            const trackCount = trackIds.length;
            const allReleaseTypes = await this.releaseTypeService.getAllReleaseTypes();
            let releaseTypeId;
            if (trackCount === 1) {
                releaseTypeId = allReleaseTypes.find(type => type.title === 'Сингл')?.id;
            } else if (trackCount >= 2 && trackCount <= 4) {
                releaseTypeId = allReleaseTypes.find(type => type.title === 'EP')?.id;
            } else if (trackCount >= 5) {
                releaseTypeId = allReleaseTypes.find(type => type.title === 'Альбом')?.id;
            }
            release.releaseType = releaseTypeId;

            // Привязываем новые треки к релизу
            for (const trackId of trackIds) {
                const track = await this.trackRepository.findByPk(trackId);
                if (track) {
                    track.releaseId = release.id;
                    await track.save();
                }
            }
        }

        // Обновляем поля релиза
        Object.assign(release, updateReleaseDto);

        // Обновляем статус публикации в зависимости от даты релиза
        const releaseDate = new Date(updateReleaseDto.releaseDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Обнуляем время для точного сравнения

        release.published = releaseDate <= today;

        await release.save();

        return this.findReleaseById(id); // Возвращаем обновленный релиз с включенными данными
    }

    async deleteRelease(id: number) {
        const release = await this.releaseRepository.findByPk(id);

        if (!release) {
            throw new NotFoundException('Релиз не найден');
        }

        await this.releaseLabelsRepository.destroy({where: {releaseId: id } });
        await this.releaseArtistsRepository.destroy({where: {releaseId: id } });
        // Открепляем все треки от релиза
        await this.trackRepository.update({ releaseId: null }, { where: { releaseId: id } });

        // Удаляем файл обложки, если он есть
        this.fileService.removeFile(release.cover);

        // Удаляем релиз из базы данных
        await release.destroy();
    }

    async adminFindReleaseByName(title: string) {
        const releases = await this.releaseRepository.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`
                }
            },
            include: [
                {
                    model: Artist,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Label,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Track,
                    attributes: ['id', 'title', 'audio', 'explicit_content', 'listens', 'releaseId', 'genreId'], // Указываем атрибуты, которые хотим получить
                    include: [
                        {
                            model: Artist,
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                        },
                        {
                            model: Genres,
                            attributes: ['id', 'name'], // Указываем атрибуты жанра, которые хотим получить
                        },
                        {
                            model: Language,
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                        }
                    ]
                },
            ],
        });
        if (!releases.length) {
            throw new NotFoundException(`Релизы по запросу: "${title}" не найдены`)
        }
        return releases;
    }

    async userFindReleaseByName(title: string) {
        const releases = await this.releaseRepository.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`
                },
                published: true // Добавляем фильтр для опубликованных релизов
            },
            include: [
                {
                    model: Artist,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Label,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Track,
                    attributes: ['id', 'title', 'audio', 'explicit_content', 'listens', 'releaseId', 'genreId'], // Указываем атрибуты, которые хотим получить
                    include: [
                        {
                            model: Artist,
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                        },
                        {
                            model: Genres,
                            attributes: ['id', 'name'], // Указываем атрибуты жанра, которые хотим получить
                        },
                        {
                            model: Language,
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                        }
                    ]
                },
            ],
        });
        if (!releases.length) {
            throw new NotFoundException(`Релизы по запросу: "${title}" не найдены`)
        }
        return releases;
    }
}
