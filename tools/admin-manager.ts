import { AdminManager, SvgIcon } from "#components";

export default defineTool({
  title: "管理员后台",
  description: "管理员的后台管理页面",
  content: () => h(AdminManager),
  icon: () =>
    h(SvgIcon, {
      name: "ri:admin-line",
    }),
});
