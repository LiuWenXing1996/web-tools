import { z } from "zod";
import prisma from "~/lib/prisma";
import { useUserSession } from "~/server/utils/user";
import {
  genDefaultSystemConfig,
  getDbCryptoHelper,
  initDefaultTools,
} from "~/server/utils/system";

const paramsSchema = z.object({
  super: z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    password: z.string().min(1),
  }),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const systemInited = await isSystemInited();
  if (systemInited) {
    throw createError({
      statusCode: 400,
      message: "系统已初始化，无法重新初始化",
    });
  }
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });

  const defaultDefaultSystemConfig = genDefaultSystemConfig();

  await prisma.systemConfig.create({
    data: {
      cryptoPassword: defaultDefaultSystemConfig.cryptoPassword,
      userSessionPassword: defaultDefaultSystemConfig.userSessionPassword,
    },
  });

  const dbCryptoHelper = await getDbCryptoHelper();
  const user = await prisma.user.create({
    data: {
      name: data.super.name,
      email: data.super.email,
      isSuper: true,
      password: dbCryptoHelper.encrypt(data.super.password),
    },
  });

  const useSession = await useUserSession(event);
  await useSession.clear();
  await useSession.update({
    id: user.id.toString(),
  });

  await initDefaultTools();

  return true;
});
