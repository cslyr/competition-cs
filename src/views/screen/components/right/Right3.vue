<template>
	<div class="es-block">
		<Title>客运强度</Title>
		<div style="width: 100%;height: 90%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud';
import axios from "axios";

const chartData = reactive({
	mapData: [],
	lastData: [],
	data: [],
})
const getData = async () => {
	let res = await axios.get('/api/urbanrail/operatepassenger')
	if (res.status == 200) {
		let data = res.data
		// console.log("data", data)
		chartData.mapData = data.map(item => {
			if (item.city != '合计' || item.city != '平均') {
				return {
					name: item.city,
					value: item.passengerIntensity
				}
			}
		})
		// console.log("chartData.mapData", chartData.mapData)
		option.value = {
			// backgroundColor: '#012248',
			tooltip: {
				show: true
			},
			toolbox: {
				feature: {
					saveAsImage: {
						iconStyle: {
							normal: {
								color: '#ffff'
							}
						}
					}
				}
			},
			series: [{
				type: 'wordCloud',
				sizeRange: [6, 66],
				rotationRange: [-45, 90],
				textPadding: 0,
				autoSize: {
					enable: true,
					minSize: 6
				},
				textStyle: {
					normal: {
						fontFamily: '微软雅黑',
						color: function () {
							return 'rgb(' +
								Math.round(Math.random() * 255) +
								', ' + Math.round(Math.random() * 255) +
								', ' + Math.round(Math.random() * 255) + ')'
						}
					},
					emphasis: {
						shadowBlur: 5,
						shadowColor: '#333'
					}
				},
			}]
		}
		option.value.series[0].data = chartData.mapData;
	}
}
getData()
let option = ref()

</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
}
</style>
