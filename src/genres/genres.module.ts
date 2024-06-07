import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Genres } from './genres.model';

@Module({
  imports: [SequelizeModule.forFeature([Genres])],
  controllers: [GenresController],
  providers: [GenresService]
})
export class GenresModule {}
