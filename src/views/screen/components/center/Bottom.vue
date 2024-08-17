<template>
	<SeamlessScroll class="es-center-bottom">
		<div v-for="item, index in actions" class="es-bottom-item">
			<svg width="60" height="60">
				<image :href="`/src/assets/svg/${index}.png`" width="60" height="60" />
			</svg>
			<div :style="{'color':item.color }">{{ item.icon }}</div>
			<!-- <ElIcon size="32" :color="item.color">
				<component :is="iconObj[item.icon]" />
			</ElIcon> -->
			<Vue3Odometer :style="{ color: item.color }" class="es-item-text" :value="item.value" />
		</div>
	</SeamlessScroll>
</template>

<script setup >
import { ref, onMounted, reactive } from 'vue'
import { ElIcon } from 'element-plus'
import Vue3Odometer from 'vue3-odometer'
import 'odometer/themes/odometer-theme-default.css'
import { KnifeFork, IceTea, Coffee, IceCream, Dessert, GobletFull } from '@element-plus/icons-vue'
import SeamlessScroll from '@/components/SeamlessScroll.vue'
import axios from "axios";

const chartData = reactive({
	data: [],
	lastData: []
})

const actions = ref([
	{ color: 'rgb(24, 144, 255)', icon: '车站总数', value: 0 },
	{ color: 'rgb(225, 130, 7)', icon: '地面站总数', value: 0 },
	{ color: 'rgb(26, 250, 41)', icon: '地下站站总数', value: 0 },
	{ color: 'rgb(17, 85, 71)', icon: '高架站总数', value: 0 },
	{ color: 'rgb(242, 82, 87)', icon: '换乘站数', value: 0 },
	{ color: 'rgb(212, 35, 122)', icon: '车辆总数', value: 0 },
	{ color: '#f45656', icon: '地铁车辆数', value: 0 },
	{ color: 'rgb(206, 65, 65)', icon: '轻轨车辆数', value: 0 },
	{ color: 'rgb(92, 219, 211)', icon: '单轨车辆数', value: 0 },
	{ color: 'rgb(179, 127, 235)', icon: '有轨车辆数', value: 0 },
	{ color: 'rgb(255, 133, 192)', icon: '磁浮车辆数', value: 0 },
	{ color: 'rgb(170, 0, 0)', icon: '快轨车辆数', value: 0 },
	{ color: '#597ef7', icon: 'APM车辆数', value: 0 },
])
const getData = async () => {
	let res = await axios.get('/api/urbanrail/constructprogress')
	if (res.status == 200) {
		let data = res.data
		// console.log("data",data)
		data.forEach(item => {
			if (item.region == '全 国' && item.constructProgress == "established") {
				chartData.data = item
			}
		})
		// console.log("data", chartData.data)
		chartData.lastData = [chartData.data['stationTotal'], chartData.data['surfaceNum'], chartData.data['undergroundNum'], chartData.data['elevatedNum'],
		chartData.data['transferNum'], chartData.data['vehicleNum'], chartData.data['subwayNum'], chartData.data['lightrailNum']
			, chartData.data['monorailNum'], chartData.data['monorailNum'], chartData.data['maglevNum'], chartData.data['fasttrackNum'],
		chartData.data['apmNum']]
		// chartData.lastData={
		// 	stationTotal:chartData.data['stationTotal'],//车站总数
		// 	surfaceNum:chartData.data['surfaceNum'],//地面站总数
		// 	undergroundNum:chartData.data['undergroundNum'],//地下站站总数
		// 	elevatedNum:chartData.data['elevatedNum'],//高架站总数
		// 	transferNum:chartData.data['transferNum'],//换乘站数

		// 	vehicleNum:chartData.data['vehicleNum'],//车辆总数
		// 	subwayNum:chartData.data['subwayNum'],//地铁车辆数
		// 	lightrailNum:chartData.data['lightrailNum'],//轻轨车辆数
		// 	monorailNum:chartData.data['monorailNum'],//单轨车辆数
		// 	cablecarNum:chartData.data['monorailNum'],//有轨车辆数

		// 	maglevNum:chartData.data['maglevNum'],//磁浮车辆数
		// 	fasttrackNum:chartData.data['fasttrackNum'],//快轨车辆数
		// 	apmNum:chartData.data['apmNum'],//APM车辆数
		// }
		actions.value.forEach((item, index) => {
			item.value = chartData.lastData[index]
		})
	}
}
getData()




const iconObj = { KnifeFork, IceTea, Coffee, IceCream, Dessert, GobletFull }


</script>

<style lang='scss' scoped>
.es-center-bottom {
	position: relative;
	width: 100%;
	overflow: hidden;
	height: 150px;

	.es-bottom-item {
		position: absolute;
		top: 0;
		left: 0;
		width: 170px;
		height: 150px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: var(--es-block-bg);
		font-size: 22px;
		font-weight: 600;

		.es-item-text {
			margin-top: 16px;
		}
	}
}
</style>
