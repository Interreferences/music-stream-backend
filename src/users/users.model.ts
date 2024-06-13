import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { Role } from "../roles/roles.model";
import {Playlist} from "../playlists/playlists.model";

interface UserCreationAttrs {
    login: string;
    nickname: string;
    password: string;
    roleId: number;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    login: string;

    @Column({ type: DataType.STRING, allowNull: false })
    nickname: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: "image/Avatar.jpg" })
    avatar: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    explicit_content: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    banned: boolean;

    @Column({ type: DataType.STRING, allowNull: true })
    bannedReason: string;

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER, allowNull: false })
    roleId: number;

    @HasMany(() => Playlist)
    playlists:Playlist[];

    @BelongsTo(() => Role)
    role: Role;
}