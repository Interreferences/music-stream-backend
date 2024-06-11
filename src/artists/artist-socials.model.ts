import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import {Artist} from "../artists/artists.model";
import {Social} from "../socials/socials.model";

@Table({ tableName: 'artist_socials' })
export class ArtistSocials extends Model<ArtistSocials> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Artist)
    @Column({ type: DataType.INTEGER, allowNull: false })
    artistId: number;

    @ForeignKey(() => Social)
    @Column({ type: DataType.INTEGER, allowNull: false })
    socialId: number;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    link: string;
}