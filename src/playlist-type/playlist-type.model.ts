import {Column, DataType, Model, Table} from "sequelize-typescript";

interface PlaylistTypeCreationAttrs {
    title: string;
}

@Table({tableName: 'playlist-type'})
export class PlaylistType extends Model<PlaylistType, PlaylistTypeCreationAttrs>{

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string;
}