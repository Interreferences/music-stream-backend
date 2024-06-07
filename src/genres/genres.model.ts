import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'genres' })
export class Genres extends Model<Genres> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;
}