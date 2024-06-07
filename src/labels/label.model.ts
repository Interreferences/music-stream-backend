import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface LabelCreationAttrs {
    name:string;
}

@Table({ tableName: 'labels' })
export class Label extends Model<Label, LabelCreationAttrs> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;
}