import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Artist} from "../artists/artists.model";
import {ArtistSocials} from "../artists/artist-socials.model";

interface SocialCreationAttrs {
    title: string;
}

@Table({tableName:'socials'})
export class Social extends Model<Social, SocialCreationAttrs>{
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string;

    @HasMany(() => ArtistSocials)
    socialArtists: ArtistSocials[];

    @BelongsToMany(() => Artist,() => ArtistSocials)
    artists: Artist[];
}