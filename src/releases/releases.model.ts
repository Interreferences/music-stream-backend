import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Artist} from "../artists/artists.model";
import {ReleaseArtists} from "./release-artists.model";

interface ReleaseCreationAttrs {
    title:string;
    audio: string;
    genreId: number;
    explicit_content: boolean;
}

@Table({ tableName: 'releases' })
export class Release extends Model<Release, ReleaseCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: false, allowNull: false})
    title: string;

    @Column({type: DataType.STRING, unique: false, allowNull: false})
    cover: string;

    @BelongsToMany(() => Artist, () => ReleaseArtists)
    artists: Artist[];
}