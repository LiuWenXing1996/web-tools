import { z } from "zod";
import { UserService } from "~/server/service/user";

export const paramsSchema = z.object({
  name: z.string().min(1),
  config: z
    .object({
      sideBar: z.object({
        tools: z.string().min(1).array().optional(),
      }),
    })
    .optional(),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const user = await requireCurrentUser(event);
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  if (user.name !== data.name) {
    await requireCurrentAdminUser(event);
  }
  const userService = new UserService();
  const setting = await userService.upsertSetting(user.id, {
    ...data.config,
  });
  return setting;
});
