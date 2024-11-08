import { Icon, UserSetting } from "#components";

export default defineTool({
  title: "用户设置",
  description: "用户设置页面",
  content: () => h(UserSetting),
  icon: () =>
    h(Icon, {
      name: "ri:settings-2-fill",
    }),
});
