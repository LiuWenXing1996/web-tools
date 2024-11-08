import { z } from "zod";
import prisma from "~/lib/prisma";

export const paramsSchema = z.undefined();
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const user = await prisma.user.findFirst({
    where: {
      id: data.id,
    },
  });
  return user;
});
