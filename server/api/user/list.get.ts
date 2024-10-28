import { z } from "zod";
import prisma from "~/lib/prisma";

export const paramsSchema = z.object({
  pageSize: z.coerce.number().min(1),
  pageIndex: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });

  const skip = (data.pageIndex - 1) * data.pageSize;
  const list = await prisma.user.findMany({
    skip: skip,
    take: data.pageSize,
  });
  return list;
});
