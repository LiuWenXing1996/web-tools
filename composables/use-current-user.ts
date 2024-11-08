import { type InternalApi } from "nitropack";
import type { Params as UserSettingUpdateParams } from "~/server/api/user/setting/update.post";

type User = InternalApi["/api/user/current"]["get"];
type UserSetting = InternalApi["/api/user/setting/detail"]["get"];
const store = shallowRef<{
  current?: User;
  setting?: UserSetting;
}>({});

export const useCurrentUser = () => {
  const userRequest = useCustomRequest(async () => {
    let user: User | undefined = undefined;
    try {
      // @ts-ignore
      user = await $fetch("/api/user/current");
    } catch (error) {}
    store.value = {
      ...store.value,
      current: user,
    };
    return user;
  });
  const current = computed(() => store.value.current);

  const settingDetailRequest = useCustomRequest(async () => {
    if (current.value) {
      const res = await $fetch("/api/user/setting/detail", {
        params: {
          name: current.value?.name,
        },
      });
      store.value = {
        ...store.value,
        setting: res,
      };
      return res;
    }
  });
  const settingUpdateRequest = useCustomRequest(
    async (params: UserSettingUpdateParams["config"]) => {
      const res = await $fetch("/api/user/setting/update", {
        method: "POST",
        body: {
          name: current.value?.name,
          config: params,
        },
      });
      return res;
    }
  );
  const setting = computed(() => store.value.setting);

  const refresh = async () => {
    await userRequest.refreshAsync();
    await settingDetailRequest.refreshAsync();
  };

  onMounted(() => {
    refresh();
  });
  return {
    current,
    setting,
    refresh,
    userRequest,
    settingDetailRequest,
    settingUpdateRequest,
  };
};
