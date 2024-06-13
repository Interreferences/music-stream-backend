import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Playlist} from "../playlists/playlists.model";

interface PlaylistTypeCreationAttrs {
    title: string;
}

@Table({tableName: 'playlist-type'})
export class PlaylistType extends Model<PlaylistType, PlaylistTypeCreationAttrs>{

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string;

    @HasMany(() => Playlist)
    playlists:Playlist[];
}