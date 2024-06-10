import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Track } from "./tracks.model";
import {Language} from "../languages/languages.model";

@Table({ tableName: 'track_languages' })
export class TrackLanguages extends Model<TrackLanguages> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Track)
    @Column({ type: DataType.INTEGER, allowNull: false })
    trackId: number;

    @ForeignKey(() => Language)
    @Column({ type: DataType.INTEGER, allowNull: false })
    languageId: number;
}