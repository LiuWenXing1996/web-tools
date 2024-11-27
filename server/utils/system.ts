import prisma from "./prisma";

export const isSystemInited = async () => {
  const envInited = process.env.SYSTEM_INITED;
  if (envInited !== undefined) {
    console.log({ envInited });
    return Boolean(envInited);
  }
  const superUser = await prisma.user.findFirst({
    where: {
      isSuper: true,
    },
  });
  if (superUser) {
    return true;
  }
  return false;
};