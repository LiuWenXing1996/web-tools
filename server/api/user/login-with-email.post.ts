import { z } from "zod";
import prisma from "~/lib/prisma";
import { useUserSession } from "~/server/utils/user";
import { getDbCryptoHelper } from "~/server/utils/system";

const paramsSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const dbCryptoHelper = await getDbCryptoHelper();
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "用户不存在",
    });
  }
  const decryptPassword = dbCryptoHelper.decrypt(user.password);
  if (data.password !== decryptPassword) {
    throw createError({
      statusCode: 401,
      message: "密码错误",
    });
  }
  const useSession = await useUserSession(event);
  await useSession.clear();
  await useSession.update({
    id: user.id.toString(),
  });

  return true;
});
