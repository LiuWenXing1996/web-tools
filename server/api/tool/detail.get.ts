import { z } from "zod";
import prisma from "~/lib/prisma";

export const paramsSchema = z.object({
  name: z.string().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });
  const tool = await prisma.tool.findFirst({
    where: {
      name: data.name,
    },
  });
  return tool;
});
