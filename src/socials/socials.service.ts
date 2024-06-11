import { Injectable } from '@nestjs/common';
import {CreateSocialDto} from "./dto/create-social.dto";
import {Social} from "./socials.model";
import {InjectModel} from "@nestjs/sequelize";

@Injectable()
export class SocialsService {

    constructor(
        @InjectModel(Social) private socialsRepository: typeof Social,
    ) {}

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
