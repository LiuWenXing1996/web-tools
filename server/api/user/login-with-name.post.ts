import { z } from "zod";
import { useUserSession } from "~/server/utils/user";

const paramsSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const user = await prisma.user.findUnique({
    where: {
      name: data.name,
    },
  });
  if (!user) {
    throw createError({
      statusCode: 404,
      message: "用户不存在",
    });
  }
  const isEqual = await compareUserPassword(data.password, user.password);
  if (!isEqual) {
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
