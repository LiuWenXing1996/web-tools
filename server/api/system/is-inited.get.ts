import { z } from "zod";
import { isSystemInited } from "~/server/utils/system";

export const paramsSchema = z.undefined();
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const systemInited = await isSystemInited();
  return systemInited;
});
