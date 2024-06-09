import { Module } from '@nestjs/common';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Language} from "./languages.model";

@Module({
  imports: [SequelizeModule.forFeature([Language])],
  controllers: [LanguagesController],
  providers: [LanguagesService]
})
export class LanguagesModule {}
