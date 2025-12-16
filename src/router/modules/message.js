import Layout from "@/layout";

const router = {
  path: "/message",
  component: Layout,
  redirect: "/message",
  name: "Message",
  meta: { title: "消息管理", icon: "el-icon-bell" },
  children: [
    {
      path: "messageList",
      name: "messageList",
      component: () => import("@/views/message/messageList"),
      meta: { title: "消息列表", icon: "el-icon-bell" },
    },
    {
      path: "noticeList",
      name: "noticeList",
      component: () => import("@/views/message/noticeList"),
      meta: { title: "待办事项", icon: "el-icon-s-flag" },
    },
  ],
};
export default router;
