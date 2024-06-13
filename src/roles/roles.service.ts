import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from "./dto/create-role.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./roles.model";

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async onModuleInit() {
        const roleTitles = ['Admin', 'User'];

        for (const title of roleTitles) {
            const role = await this.getRoleByValue(title);

            if (!role) {
                const defaultRoleDto: CreateRoleDto = {
                    value: title
                };
                await this.createRole(defaultRoleDto);
            }
        }
    }

    async createRole(dto: CreateRoleDto): Promise<Role> {
        return this.roleRepository.create(dto);
    }

    async getRoleByValue(value: string): Promise<Role> {
        return this.roleRepository.findOne({ where: { value } });
    }
}