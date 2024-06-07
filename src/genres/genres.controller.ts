import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres')
export class GenresController {
    constructor(private genresService: GenresService) {}

    @Post()
    create(@Body() dto: CreateGenreDto) {
        return this.genresService.createGenre(dto);
    }

    @Get()
    getAll() {
        return this.genresService.getAllGenres();
    }

    @Get('search') // Перенесли этот метод вверх
    findByName(@Query('name') name: string) {
        return this.genresService.findGenreByName(name);
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.genresService.getGenreById(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateGenreDto) {
        return this.genresService.updateGenre(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.genresService.deleteGenre(id);
    }
}

