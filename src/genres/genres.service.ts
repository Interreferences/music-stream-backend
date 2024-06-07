import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genres } from './genres.model';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
    constructor(@InjectModel(Genres) private genreRepository: typeof Genres) {}

    async createGenre(dto: CreateGenreDto) {
        const genre = await this.genreRepository.create(dto);
        return genre;
    }

    async getAllGenres() {
        return await this.genreRepository.findAll();
    }

    async getGenreById(id: number) {
        return await this.genreRepository.findByPk(id);
    }

    async updateGenre(id: number, dto: UpdateGenreDto) {
        const genre = await this.genreRepository.findByPk(id);
        if (!genre) {
            throw new Error('Genre not found');
        }
        return await genre.update(dto);
    }

    async deleteGenre(id: number) {
        const genre = await this.genreRepository.findByPk(id);
        if (genre) {
            await genre.destroy();
        }
        return genre;
    }

    async findGenreByName(name: string) {
        return await this.genreRepository.findOne({ where: { name } });
    }
}
