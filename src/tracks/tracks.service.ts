import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Track} from "./tracks.model";
import {FileService, FileType} from "../file/file.service";
import {CreateTrackDto} from "./dto/create-track.dto";
import {UpdateTrackDto} from "./dto/update-track.dto";
import {TrackArtists} from "./track-artists.model";
import {TrackLanguages} from "./track-languages.model";
import {Artist} from "../artists/artists.model";
import {Language} from "../languages/languages.model";
import {Op} from "sequelize";
@Injectable()
export class TracksService {
    constructor(
        @InjectModel(Track) private trackRepository: typeof Track,
        @InjectModel(TrackArtists) private trackArtistsRepository: typeof TrackArtists,
        @InjectModel(TrackLanguages) private trackLanguagesRepository: typeof TrackLanguages,
        private fileService: FileService
    ) {}

    async createTrack(createTrackDto: CreateTrackDto, audio) {
        const filePath = await this.fileService.createFile(FileType.AUDIO, audio);

        const track = await this.trackRepository.create({
            ...createTrackDto,
            audio: filePath,
            listens: 0,
        });

        const artistIds = createTrackDto.artistIds;
        for (const artistId of artistIds) {
            await this.trackArtistsRepository.create({
                trackId: track.id,
                artistId: artistId
            });
        }

        const languageIds = createTrackDto.languageIds;
        for (const languageId of languageIds) {
            await this.trackLanguagesRepository.create({
                trackId: track.id,
                languageId: languageId
            });
        }

        return track;
    }

    async findAllTracks() {
        return await this.trackRepository.findAll({
            include: [
                {
                    model: Artist,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Language,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
            ],
        });
    }

    async findTrackById(id: number) {
        const track = await this.trackRepository.findByPk(id, {
            include: [
                {
                    model: Artist,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Language,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
            ],
        });
        if (!track) {
            throw new NotFoundException('Трек не найден');
        }
        return track;
    }

    async updateTrack(id: number, updateTrackDto: UpdateTrackDto, audio?: any) {
        const track = await this.trackRepository.findByPk(id);

        if (!track) {
            throw new NotFoundException('Трек не найден');
        }

        // Обновление аудиофайла
        if (audio) {
            // Удаление старого файла
            await this.fileService.removeFile(track.audio);
            // Создание нового файла
            const filePath = await this.fileService.createFile(FileType.AUDIO, audio);
            track.audio = filePath;
        }

        // Обновление трека
        await track.update(updateTrackDto);

        // Обновление артистов
        if (updateTrackDto.artistIds) {
            await this.trackArtistsRepository.destroy({ where: { trackId: id } });
            for (const artistId of updateTrackDto.artistIds) {
                await this.trackArtistsRepository.create({
                    trackId: id,
                    artistId: artistId
                });
            }
        }

        // Обновление языков
        if (updateTrackDto.languageIds) {
            await this.trackLanguagesRepository.destroy({ where: { trackId: id } });
            for (const languageId of updateTrackDto.languageIds) {
                await this.trackLanguagesRepository.create({
                    trackId: id,
                    languageId: languageId
                });
            }
        }

        // Save the updated track to ensure audio path is stored
        await track.save();

        return this.findTrackById(id); // Возвращаем обновленный трек с включенными данными об артистах и языках
    }

    async deleteTrack(id: number) {
        const track = await this.trackRepository.findByPk(id);

        if (!track) {
            throw new NotFoundException('Трек не найден');
        }

        // Удаление записей из промежуточных таблиц
        await this.trackArtistsRepository.destroy({ where: { trackId: id } });
        await this.trackLanguagesRepository.destroy({ where: { trackId: id } });

        // Удаление аудиофайла
        this.fileService.removeFile(track.audio);

        // Удаление трека
        await track.destroy();
    }

    async adminFindTrackByName(title: string) {
        const tracks = await this.trackRepository.findAll({
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
                    model: Language,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
            ],
        });
        if (!tracks.length) {
            throw new NotFoundException(`Треки по запросу: "${title}" не найдены`)
        }
        return tracks;
    }

    async userFindTracksByName(title: string) {
        const tracks = await this.trackRepository.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`
                },
                releaseId: {
                    [Op.ne]: 0
                }
            },
            include: [
                {
                    model: Artist,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
                {
                    model: Language,
                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                },
            ],
        });
        if (!tracks.length) {
            throw new NotFoundException(`Треки по запросу: "${title}" не найдены`)
        }
        return tracks;
    }
}
