import SEQUELIZE from '../../database/sequelize.js';
import { User } from '@/interfaces/user.interfaces';

export const repo = {
    getUserProfile: async (
        userId: string | undefined,
    ): Promise<User | null> => {
        return await SEQUELIZE.Users.findOne({ where: { id: userId } });
    },
};
