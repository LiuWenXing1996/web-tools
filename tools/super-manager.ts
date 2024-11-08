import { Icon, SuperManager } from "#components";

export default defineTool({
  title: "超管后台",
  description: "超级管理员的后台管理页面",
  content: () => h(SuperManager),
  icon: () =>
    h(Icon, {
      name: "ri:admin-fill",
    }),
});
