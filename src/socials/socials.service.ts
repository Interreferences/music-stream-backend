import { Injectable } from '@nestjs/common';
import {CreateSocialDto} from "./dto/create-social.dto";
import {Social} from "./socials.model";
import {InjectModel} from "@nestjs/sequelize";

@Injectable()
export class SocialsService {

    constructor(
        @InjectModel(Social) private socialsRepository: typeof Social,
    ) {}

    async onModuleInit() {
        const socialTitles = ['VK', 'YouTube', 'Instagram', 'Telegram', 'X', 'TikTok', 'Facebook', 'Другое']

        for (const title of socialTitles) {
            const social = await this.getSocialByTitle(title);

            if (!social) {
                const defaultSocialDto: CreateSocialDto = {
                    title: title
                };
                await this.createSocial(defaultSocialDto);
            }
        }
    }

    async createSocial(dto: CreateSocialDto) {
        const social = await this.socialsRepository.create(dto);
        return social;
    }

    async getAllSocials() {
        return await this.socialsRepository.findAll()
    }

    async getSocialByTitle(title: string) {
        return this.socialsRepository.findOne({where: {title} });
    }
}
