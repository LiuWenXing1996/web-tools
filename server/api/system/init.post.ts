import { z } from "zod";
import prisma from "~/server/utils/prisma";
import { isSystemInited } from "~/server/utils/system";
import { encryptUserPassword, useUserSession } from "~/server/utils/user";

const paramsSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
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

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      isSuper: true,
      password: await encryptUserPassword(data.password),
    },
  });

  const useSession = await useUserSession(event);
  await useSession.clear();
  await useSession.update({
    id: user.id.toString(),
  });

  return true;
});
