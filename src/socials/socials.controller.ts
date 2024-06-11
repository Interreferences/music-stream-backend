import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {SocialsService} from "./socials.service";
import {CreateSocialDto} from "./dto/create-social.dto";

@Controller('socials')
export class SocialsController {

    constructor(private socialsService: SocialsService) {}

    @Post()
    async create(@Body() dto: CreateSocialDto) {
        return this.socialsService.createSocial(dto);
    }

    @Get()
    async getAll() {
        return this.socialsService.getAllSocials();
    }

    @Get('/:title')
    async getByValue(@Param('title') title: string) {
        return this.socialsService.getSocialByTitle(title);
    }
}
