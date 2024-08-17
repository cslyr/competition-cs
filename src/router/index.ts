import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Screen from "@/views/screen/index.vue";
import detail from "@/views/forecas/index.vue";
import peopleNumber from "@/views/forecas/peopleNumber/index.vue";
import economic from "@/views/forecas/economic/index.vue";
import traffic from "@/views/forecas/traffic/index.vue";
import { useScreenStore } from "@/store";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/screen",
	},
	{
		path: "/screen",
		component: Screen,
	},
	{
		path: "/forecastDetails",
		component: detail,
	},
	{
		path: "/peopleNumberDetail",
		component: peopleNumber,
	},
	{
		path: "/economic",
		component: economic,
	},
	{
		path: "/traffic",
		component: traffic,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
router.beforeEach((to, from, next) => {
	const store = useScreenStore();
	if (to.path === "/screen") {
		store.stateMethod = 3;
		next();
		// 进行操作
	} else {
		next();
	}
});
export default router;
