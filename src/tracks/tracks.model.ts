import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Genres} from "../genres/genres.model";
import {Artist} from "../artists/artists.model";
import {TrackArtists} from "./track-artists.model";
import {Release} from "../releases/releases.model";
import {Language} from "../languages/languages.model";
import {TrackLanguages} from "./track-languages.model";

interface TrackCreationAttrs {
    title:string;
    audio: string;
    genreId: number;
    listens: number;
    explicit_content: boolean;
}

@Table({ tableName: 'tracks' })
export class Track extends Model<Track, TrackCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: false, allowNull: false})
    title: string;

    @Column({type: DataType.STRING, unique: false, allowNull: false})
    audio: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    explicit_content: boolean;

    @Column({type: DataType.INTEGER, allowNull: false})
    listens: number;

    @Column({type: DataType.TEXT, allowNull: true})
    text: string;

    @Column({type: DataType.STRING, unique: false, allowNull: true})
    clip: string;

    @ForeignKey(() => Release)
    @Column({type:DataType.INTEGER, allowNull:true})
    releaseId:number;

    @ForeignKey(() => Genres)
    @Column({ type: DataType.INTEGER, allowNull: false })
    genreId: number;

    @BelongsTo(() => Genres)
    genre: Genres;

    @BelongsToMany(() => Language, () => TrackLanguages)
    languages: Language[];

    @BelongsToMany(() => Artist, () => TrackArtists)
    artists: Artist[];
}