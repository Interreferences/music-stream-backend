import { Injectable } from '@nestjs/common';
import {CreateReleaseTypeDto} from "./dto/create-release-type.dto";
import {ReleaseType} from "./release-type.model";
import {InjectModel} from "@nestjs/sequelize";

@Injectable()
export class ReleaseTypeService {

    constructor(@InjectModel(ReleaseType) private releaseTypeRepository: typeof ReleaseType) {}

    async createReleaseType(dto: CreateReleaseTypeDto) {
        return this.releaseTypeRepository.create(dto);
    }

    async getReleaseTypeByValue(title: string) {
        return this.releaseTypeRepository.findOne({where: {title}});
    }

    async getAllReleaseTypes() {
        return this.releaseTypeRepository.findAll();
    }

}
