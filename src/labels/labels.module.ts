import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Label} from "./label.model";
import {LabelsController} from "./labels.controller";
import {LabelsService} from "./labels.service";

@Module({
    imports: [SequelizeModule.forFeature([Label])],
    controllers: [LabelsController],
    providers: [LabelsService]
})
export class LabelsModule {}
