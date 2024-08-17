<template>
	<div class="es-block">
		<Title>运营服务(运行节奏最快的十个城市)</Title>
		<div style="width: 100%;height: 90%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup >
import { reactive, ref } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import * as echarts from 'echarts'
import axios from "axios";


const chartData = reactive({
	city: [],
	averageSpeed: [],
	intervalTime: []
})
let borderData = ref([]);
let option = ref()
const getData = async () => {
	let res = await axios.get('/api/urbanrail/operateservice')
	if (res.status == 200) {
		let data = res.data

		let templateData=data.slice().sort((a, b) => b.averageSpeed - a.averageSpeed)
		let getTemplateData=templateData.slice(0, 10)
		getTemplateData.forEach(item => {
			chartData.city.push(item.city)
			chartData.averageSpeed.push(item.averageSpeed)
			chartData.intervalTime.push(item.intervalTime)
		})
		console.log("chartData.city",chartData.city)
		console.log("	chartData.averageSpeed",	chartData.averageSpeed)
		console.log("chartData.intervalTime",chartData.intervalTime)
		chartData.city.unshift('  ')
		var xData = chartData.city
		var timeLineData = [1];
		let legend = ['平均速度', '最小间隔'];
		let textColor = "#fff";
		let lineColor = "rgba(255,255,255,0.2)";
		let colors = [{
			borderColor: "rgba(227,161,96,1)",
			start: "rgba(227,161,96,0.8)",
			end: "rgba(227,161,96,0.3)"
		},
		{
			borderColor: "rgba(0,222,255,1)",
			start: "rgba(0,222,255,0.3)",
			end: "rgba(0,222,255,0.8)"
		},
		];
		let scale = 2;
		borderData.value = xData.map(item => {
			return scale;
		});
		option.value = {
			baseOption: {
				timeline: {
					show: false,
					top: 0,
					data: []
				},
				legend: {
					top: '0%',
					right: '0%',
					itemWidth: 20,
					itemHeight: 5,
					// itemGap: 343,
					icon: 'horizontal',
					textStyle: {
						color: '#ffffff',
						fontSize: 20,
					},
					data: legend
				},
				grid: [{
					show: false,
					left: '0%',
					top: '10%',
					bottom: '0%',
					containLabel: true,
					width: '37%'
				}, {
					show: false,
					left: '51%',
					top: '10%',
					bottom: '8%',
					width: '0%'
				}, {
					show: false,
					right: '2%',
					top: '10%',
					bottom: '0%',
					containLabel: true,
					width: '37%'
				}],
				xAxis: [
					{
						type: 'value',
						inverse: true,
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						position: 'top',
						axisLabel: {
							show: true,
							color: textColor
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: lineColor
							}
						},
					}, {
						gridIndex: 1,
						// show: false

					}, {
						gridIndex: 2,
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						position: 'top',
						axisLabel: {
							show: true,
							color: textColor
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: lineColor
							}
						},
					}],
				yAxis: [{
					type: 'category',
					inverse: true,
					position: 'right',
					axisLine: {
						show: true,
						lineStyle: {
							color: lineColor
						}
					},

					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					data: xData
				}, {
					gridIndex: 1,
					type: 'category',
					inverse: true,
					position: 'left',
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: true,
						padding: [100, 0, 0, 0],
						textStyle: {
							color: '#ffffff',
							fontSize: 20
						},
						align: "center"
					},
					data: xData.map(function (value) {
						return {
							value: value,
							textStyle: {
								align: 'center'
							}
						}
					})
				},

				{
					gridIndex: 2,
					type: 'category',
					inverse: true,
					position: 'left',
					axisLine: {
						show: true,
						lineStyle: {
							color: lineColor
						}
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false

					},
					data: xData
				}],
				series: []

			},
			options: []
		}


		option.value.baseOption.timeline.data.push(timeLineData[0])
		option.value.baseOption.tooltip = {
			show: true,
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		}
		option.value.options.push({
			series: [
				{
					name: "平均速度",
					type: "bar",
					barWidth: 15,
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
								offset: 0,
								color: colors[0].start
							},
							{
								offset: 1,
								color: colors[0].end
							}
							]),
						}
					},
					label: {
						normal: {
							show: false,
						}
					},
					data: chartData.averageSpeed,
					animationEasing: "elasticOut"
				},
				{
					name: "最小间隔",
					type: "bar",
					barWidth: 15,
					xAxisIndex: 2,
					yAxisIndex: 2,
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
								offset: 0,
								color: colors[1].start
							},
							{
								offset: 1,
								color: colors[1].end
							}
							]),
						}
					},
					label: {
						normal: {
							show: false,
						}
					},
					data: chartData.intervalTime,
					animationEasing: "elasticOut"
				}
			]
		});
	}
}
getData()

</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
}
</style>
