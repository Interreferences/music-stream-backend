import {Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post} from '@nestjs/common';
import {LanguagesService} from "./languages.service";
import {CreateLanguageDto} from "./dto/create-language.dto";
import {UpdateLanguageDto} from "./dto/update-language.dto";

@Controller('languages')
export class LanguagesController {

    constructor(private readonly languagesService: LanguagesService) {}

    @Post()
    async create(@Body() createLanguageDto: CreateLanguageDto) {
        return this.languagesService.createLanguage(createLanguageDto);
    }

    @Get()
    async findAll() {
        return this.languagesService.findAllLanguages();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.languagesService.findLanguageById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateLanguageDto: UpdateLanguageDto) {
        const updatedLanguage = await this.languagesService.updateLanguage(id, updateLanguageDto);
        return updatedLanguage;
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.languagesService.deleteLanguage(id);
        return { message: 'Язык удален' };
    }

    @Get('search/:name')
    async findByName(@Param('name') name: string) {
        try {
            return await this.languagesService.findLanguagesByName(name);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            throw error;
        }
    }
}
