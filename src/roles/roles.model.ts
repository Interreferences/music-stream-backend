import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";

interface RoleCreationAttrs {
    value: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    value: string;

    @HasMany(() => User)
    users: User[];
}