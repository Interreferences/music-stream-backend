import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {PlaylistType} from "../playlist-type/playlist-type.model";
import {User} from "../users/users.model";
import {Track} from "../tracks/tracks.model";
import {PlaylistTracks} from "./playlist-tracks.model";

interface PlaylistCreationAttrs {
    title: string;
    cover: string;
    playlistTypeId: number;
    public: boolean;
    userId?: number;
}

@Table({tableName: 'playlists'})
export class Playlist extends Model<Playlist, PlaylistCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    cover: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false})
    public: boolean;

    @Column({type: DataType.TEXT, allowNull: true})
    description: string;

    @ForeignKey(() => PlaylistType)
    @Column({ type: DataType.INTEGER, allowNull: false })
    playlistTypeId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsToMany(() => Track, () => PlaylistTracks)
    tracks: Track[];

    @BelongsTo(() => User) // Добавляем связь belongsTo с моделью User
    user: User;

    @BelongsTo(() => PlaylistType) // Добавляем связь belongsTo с моделью User
    playlistType: PlaylistType;

}