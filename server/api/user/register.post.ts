import { z } from "zod";
import { useUserSession } from "~/server/utils/user";

const paramsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const userNameFound = await prisma.user.findUnique({
    where: {
      name: data.name,
    },
  });
  if (userNameFound) {
    throw createError({
      statusCode: 400,
      message: "用户名称已存在",
    });
  }
  const userEmailFound = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (userEmailFound) {
    throw createError({
      statusCode: 400,
      message: "用户邮箱已存在",
    });
  }
  const isFirstUser = !Boolean(await prisma.user.findFirst());
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      isAdmin: isFirstUser,
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
