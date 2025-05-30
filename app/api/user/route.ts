import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};
