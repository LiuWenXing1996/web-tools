import { z } from "zod";
import prisma from "~/lib/prisma";

const paramsSchema = z.object({
  name: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  await requireCurrentAdminUser(event);
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  await prisma.tool.delete({
    where: {
      name: data.name,
    },
  });

  return true;
});
