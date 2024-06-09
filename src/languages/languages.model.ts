import { Column, DataType, Model, Table } from "sequelize-typescript";
interface LanguageCreationAttrs {
    name: string;
}
@Table({ tableName: 'languages' })
export class Language extends Model<Language, LanguageCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;
}