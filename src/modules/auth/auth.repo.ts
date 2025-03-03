import SEQUELIZE from '../../database/sequelize.js';
import { User } from '@/interfaces/user.interfaces';

const repo = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        return await SEQUELIZE.Users.findOne({ where: { email } });
    },

    createUser: async (userData: User): Promise<User> => {
        return await SEQUELIZE.Users.create(userData);
    },
};

export default repo;
