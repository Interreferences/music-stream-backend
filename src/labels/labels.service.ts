import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Label } from './label.model';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import {Op} from "sequelize";
import {Track} from "../tracks/tracks.model";

@Injectable()
export class LabelsService {
    constructor(@InjectModel(Label) private labelRepository: typeof Label) {}

    async createLabel(createLabelDto: CreateLabelDto): Promise<Label> {
        return await this.labelRepository.create(createLabelDto);
    }

    async findAllLabels(): Promise<Label[]> {
        return await this.labelRepository.findAll();
    }

    async findLabelById(id: number): Promise<Label> {
        return await this.labelRepository.findByPk(id,{
            include: [
                {
                    model: Track,
                    through: { attributes: [] },
                }
            ],
        });
    }

    async updateLabel(id: number, dto: UpdateLabelDto): Promise<Label> {
        const label = await this.labelRepository.findByPk(id);
        if (!label) {
            throw new NotFoundException('Лейбл с таким ID не найден');
        }
        await label.update(dto);
        return label;
    }

    async deleteLabel(id: number): Promise<Label> {
       const label = await this.labelRepository.findByPk(id);
       if (label) {
          await label.destroy();
       }
       return label;
    }

    async findLabelByName(name: string): Promise<Label[]> {
        const labels = await this.labelRepository.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        });
        if (!labels.length) {
            throw new NotFoundException(`Labels with name containing "${name}" not found`);
        }
        return labels;
    }
}