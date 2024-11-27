import { assign } from "radash";
import { jsonParseSafely } from "~/utils";

export interface UserSetting {
  sideBar?: {
    tools?: Record<string, boolean>;
  };
}

export class UserService {
  async getSetting(id: number) {
    const settingJson = (
      await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          setting: true,
        },
      })
    )?.setting;
    const setting = jsonParseSafely<UserSetting>(settingJson);
    return setting;
  }
  async upsertSetting(id: number, data: Partial<UserSetting>) {
    const oldSetting = await this.getSetting(id);
    const newSetting = assign(oldSetting || {}, data || {});
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        setting: JSON.stringify(newSetting),
      },
    });
    const setting = jsonParseSafely<UserSetting>(user.setting);
    return setting;
  }
}
