import { z } from "zod";
import prisma from "~/lib/prisma";

const paramsSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  await requireCurrentAdminUser(event);
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const tool = await prisma.tool.update({
    where: {
      name: data.name,
    },
    data: {
      title: data.title,
      description: data.description,
      icon: data.icon,
    },
  });

  return tool;
});
