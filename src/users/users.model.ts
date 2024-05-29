import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";

interface UserCreationAttrs{
    login:string;
    nickname:string;
    password:string;
}

@Table({tableName:'users'})
export class User extends Model<User, UserCreationAttrs>{

    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;

    @Column({type:DataType.STRING, unique:true, allowNull:false})
    login:string;

    @Column({type:DataType.STRING, allowNull:false})
    nickname:string;

    @Column({type:DataType.STRING, allowNull:false})
    password:string;

    @Column({type:DataType.STRING, allowNull:false, defaultValue:"Avatar.jpg"})
    avatar:string;

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    explicit_content:boolean;

    @Column({type:DataType.BOOLEAN, allowNull:false, defaultValue:false})
    banned:boolean;

    @Column({type:DataType.STRING, allowNull: true})
    bannedReason:string;

    @BelongsToMany( () => Role, () => UserRoles)
    roles:Role[];
}