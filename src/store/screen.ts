import { defineStore } from "pinia";

interface ScreenState {
	title: string;
	theme: "dark" | "light";
	stateScreen: any;
	stateMethod: any;
	content: string;
}

export const useScreenStore = defineStore({
	id: "screen",
	state: (): ScreenState => {
		return {
			title: "轨道交通数据分析可视化",
			theme: "dark",
			stateScreen: true,
			stateMethod: 3,
			content: "",
		};
	},
	actions: {
		changeStateMethod(state) {
			this.stateMethod=state
		},

	},
	getters: {
    getState() {
      return (this as any).stateMethod;
    },
  },
});
