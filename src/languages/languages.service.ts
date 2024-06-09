import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateLanguageDto} from "./dto/create-language.dto";
import {UpdateLanguageDto} from "./dto/update-language.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Language} from "./languages.model";
import {Op} from "sequelize";

@Injectable()
export class LanguagesService {
    constructor(@InjectModel(Language) private languageRepository: typeof Language) {}
    async createLanguage(createLanguageDto: CreateLanguageDto) {
        return await this.languageRepository.create(createLanguageDto);
    }

    async findAllLanguages() {
        return await this.languageRepository.findAll();
    }

    async findLanguageById(id: number) {
        return await this.languageRepository.findByPk(id);
    }

    async updateLanguage(id: number, updateLanguageDto: UpdateLanguageDto) {
        const language = await this.languageRepository.findByPk(id);
        if (!language) {
            throw new NotFoundException('Язык с таким ID не найден');
        }
        await language.update(updateLanguageDto);
        return language;
    }

    async deleteLanguage(id: number) {
        const language = await this.languageRepository.findByPk(id);
        if (language) {
            await language.destroy();
        }
        return language;
    }

    async findLanguagesByName(name: string) {
        const languages = await this.languageRepository.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        });
        if (!languages.length) {
            throw new NotFoundException(`Язык с таким названием не найден`);
        }
        return languages;
    }
}
