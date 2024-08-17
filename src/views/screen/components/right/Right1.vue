<template>
	<div class="es-block">
		<Title>全国历年轨道交通</Title>
		<div style="width: 100%;height: 90%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup >
import { ref, reactive } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import allData from '@/assets/data/hot.json'
import * as echarts from 'echarts'
import axios from "axios";

const chartData = reactive({
	mapData: [],
	year: [],
	constructlinesRatio: [],//建成与未建轨道交通线路长度之比
	constructcitiesRatio: []//建成与在建轨道交通城市个数之比
})
const getData = async () => {
	let res = await axios.get('/api/urbanrail/nationconstruct')
	if (res.status == 200) {
		let data = res.data
		data.forEach(item => {
			if (item.constructcitiesRatio != 0 && item.constructlinesRatio != 0) {
				chartData.mapData.push(item)
			}
		})
		chartData.mapData = chartData.mapData.sort((a, b) => a.year - b.year)
		chartData.mapData.forEach(item => {
			chartData.year.push(item.year)
			chartData.constructcitiesRatio.push(item.constructcitiesRatio)
			chartData.constructlinesRatio.push(item.constructlinesRatio)
		})
	}
	let echartData = [{
		name: "1",
		value1: 100,
		value2: 233
	},
	{
		name: "2",
		value1: 138,
		value2: 233
	},
	{
		name: "3",
		value1: 350,
		value2: 200
	},
	{
		name: "4",
		value1: 173,
		value2: 180
	},
	{
		name: "5",
		value1: 180,
		value2: 199
	},
	{
		name: "6",
		value1: 150,
		value2: 233
	},
	{
		name: "7",
		value1: 180,
		value2: 210
	},
	{
		name: "8",
		value1: 230,
		value2: 180
	}
	];
	let yAxisData1 = echartData.map(v => v.value1);
	// [100, 138, 350, 173, 180, 150, 180, 230]
	let yAxisData2 = echartData.map(v => v.value2);
	// [233, 233, 200, 180, 199, 233, 210, 180]
	const hexToRgba = (hex, opacity) => {
		let rgbaColor = "";
		let reg = /^#[\da-f]{6}$/i;
		if (reg.test(hex)) {
			rgbaColor = `rgba(${parseInt("0x" + hex.slice(1, 3))},${parseInt(
				"0x" + hex.slice(3, 5)
			)},${parseInt("0x" + hex.slice(5, 7))},${opacity})`;
		}
		return rgbaColor;
	}
	let color = [
		"#8B5CFF",
		"#36CE9E",
		"#FFC005",
		"#FF515A",
		"#8B5CFF",
		"#00CA69"
	];
	option.value = {
		// backgroundColor: bgColor,
		color: color,
		legend: {
			right: 5,
			top: 3,
			data: ['建成与在建轨道交通城市个数之比', '建成与未建轨道交通线路长度之比'],
			textStyle: {
				color: '#fff',
				fontSize: 17
			}
		},
		tooltip: {
			trigger: "axis",
			formatter: function (params) {
				let html = '';
				params.forEach(v => {
					html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                ${v.seriesName}.${v.name}
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}</span>
                万元`;
				})
				return html
			},
			extraCssText: ' border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
			axisPointer: {
				type: 'shadow',
				shadowStyle: {
					color: '#222733',
					shadowColor: 'rgba(225,225,225,1)',
					shadowBlur: 5
				}
			}
		},
		grid: {
			top: '18%',
			left: '5%',
			right: '5%',
			bottom: '0%',
			containLabel: true,
		},
		xAxis: [{
			type: "category",
			boundaryGap: false,
			axisLabel: {
				formatter: '{value}月',
				textStyle: {
					color: "#aacccc"
				},
				rotate: 45,
				interval: 0
			},
			axisLine: {
				lineStyle: {
					color: "#D9D9D9"
				}
			},
			data: chartData.year
		}],
		yAxis: [{
			type: "value",
			axisLabel: {
				textStyle: {
					color: "#aacccc"
				}
			},
			nameTextStyle: {
				color: "#aacccc",
				fontSize: 12,
				lineHeight: 40
			},
			splitLine: {
				lineStyle: {
					type: "dashed",
					color: "#E9E9E9"
				}
			},
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			}
		}],
		series: [
			{
			name: "建成与在建轨道交通城市个数之比",
			type: "line",
			smooth: true,
			// showSymbol: false,/
			symbolSize: 8,
			zlevel: 3,
			lineStyle: {
				normal: {
					color: color[4],
					shadowBlur: 3,
					shadowColor: hexToRgba(color[4], 0.5),
					shadowOffsetY: 8
				}
			},
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[{
							offset: 0,
							color: hexToRgba(color[4], 0.3)
						},
						{
							offset: 1,
							color: hexToRgba(color[4], 0.1)
						}
						],
						false
					),
					shadowColor: hexToRgba(color[4], 0.1),
					shadowBlur: 10
				}
			},
			data: chartData.constructcitiesRatio
		},
		{
			name: "建成与未建轨道交通线路长度之比",
			type: "line",
			smooth: true,
			// showSymbol: false,
			symbolSize: 8,
			zlevel: 3,
			lineStyle: {
				normal: {
					color: color[5],
					shadowBlur: 3,
					shadowColor: hexToRgba(color[5], 0.5),
					shadowOffsetY: 8
				}
			},
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[{
							offset: 0,
							color: hexToRgba(color[5], 0.3)
						},
						{
							offset: 1,
							color: hexToRgba(color[5], 0.1)
						}
						],
						false
					),
					shadowColor: hexToRgba(color[5], 0.1),
					shadowBlur: 10
				}
			},
			data: chartData.constructlinesRatio
		}]
	}
}

getData()


let option = ref()
//  ["1", "2", "3", "4", "5", "6", "7", "8"]


</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
}
</style>
