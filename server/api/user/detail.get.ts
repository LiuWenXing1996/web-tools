import { z } from "zod";
import prisma from "~/lib/prisma";

export const paramsSchema = z.object({
  id: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });
  const user = await prisma.user.findFirst({
    where: {
      id: data.id,
    },
  });
  return user;
});
