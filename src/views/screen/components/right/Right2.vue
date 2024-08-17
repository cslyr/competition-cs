<template>
	<div class="es-block">
		<Title>收支比</Title>
		<div style="width: 100%;height: 90%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup >
import { ref, reactive } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import allData from '@/assets/data/stock.json'
import * as echarts from 'echarts'
import axios from "axios";

const chartData = reactive({
	mapData: [],
	lastData: [],
	data: [],
	standard: [],
	average: []
})
const getData = async () => {
	let res = await axios.get('/api/urbanrail/operateincome')
	if (res.status == 200) {
		let data = res.data
		data.forEach(item => {
			if (item.cityScale == null) {
				chartData.mapData.push(item)
			}
		})
		chartData.mapData.forEach(item => {
			switch (item.lineScale) {
				case "100公里以下":
					chartData.lastData[0] = item
					break;
				case "100~200公里":
					chartData.lastData[1] = item
					break;
				case "200~300公里":
					chartData.lastData[2] = item
					break;
				case "300~500公里":
					chartData.lastData[3] = item
					break;
				case "500公里以上":
					chartData.lastData[4] = item
					break;
			}
		})
		console.log("chartData.lastData", chartData.lastData)
		chartData.lastData.forEach(item => {
			chartData.standard.push(item.standard)
			chartData.average.push(item.average)
		})
		console.log("chartData.max", chartData.max)
		console.log("chartData.min", chartData.min)
		console.log("chartData.average", chartData.average)
		// chartData.lastData.map(item => {
		// 	let value = [item["average"], item["median"], item["max"], item["min"], item["standard"]]
		// 	chartData.data.push(value)
		// })
		var legendData = ['平均值', '标准差']; //图例
		var indicator = [{
			text: '100公里以下',
			max: 70,
		},
		{
			text: '100~200公里',
			max: 70
		},
		{
			text: '200~300公里',
			max: 70
		},
		{
			text: '300~500公里',
			max: 70,
		},
		{
			text: '500公里以上',
			max: 70
		}
		];
		var dataArr = [
			{
			value: chartData.average,
			name: legendData[0],
			itemStyle: {
				normal: {
					lineStyle: {
						color: '#4A99FF',
						// shadowColor: '#4A99FF',
						// shadowBlur: 10,
					},
					shadowColor: '#4A99FF',
					shadowBlur: 10,
				},
			},
			areaStyle: {
				normal: { // 单项区域填充样式
					color: {
						type: 'linear',
						x: 0, //右
						y: 0, //下
						x2: 1, //左
						y2: 1, //上
						colorStops: [{
							offset: 0,
							color: '#4A99FF'
						}, {
							offset: 0.5,
							color: 'rgba(0,0,0,0)'
						}, {
							offset: 1,
							color: '#4A99FF'
						}],
						globalCoord: false
					},
					opacity: 1 // 区域透明度
				}
			}
		},
		{
			value: chartData.standard,
			name: legendData[1],
			itemStyle: {
				normal: {
					lineStyle: {
						color: '#4BFFFC',
						// shadowColor: '#4BFFFC',
						// shadowBlur: 10,
					},
					shadowColor: '#4BFFFC',
					shadowBlur: 10,
				},
			},
			areaStyle: {
				normal: { // 单项区域填充样式
					color: {
						type: 'linear',
						x: 0, //右
						y: 0, //下
						x2: 1, //左
						y2: 1, //上
						colorStops: [{
							offset: 0,
							color: '#4BFFFC'
						}, {
							offset: 0.5,
							color: 'rgba(0,0,0,0)'
						}, {
							offset: 1,
							color: '#4BFFFC'
						}],
						globalCoord: false
					},
					opacity: 1 // 区域透明度
				}
			}
		},
		];
		var colorArr = ['#4A99FF', '#4BFFFC']; //颜色
		option.value = {
			color: colorArr,
			legend: {
				orient: 'vertical',
				icon: 'circle', //图例形状
				data: legendData,
				top: 0,
				right: 20,
				itemWidth: 14, // 图例标记的图形宽度。[ default: 25 ]
				itemHeight: 14, // 图例标记的图形高度。[ default: 14 ]
				itemGap: 21, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
				textStyle: {
					fontSize: 14,
					color: '#00E4FF',
				},
			},
			tooltip: {
				show: true,
				trigger: 'item',
				backgroundColor: 'rgba(0,0,0,0.7)',
				textStyle: {
					color: '#fff',
					fontSize: 12,
				},
			},
			radar: {
				// shape: 'circle',
				name: {
					textStyle: {
						color: '#fff',
						fontSize: 16
					},
				},
				indicator: indicator,
				splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
					show: true,
					areaStyle: { // 分隔区域的样式设置。
						color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
					}
				},
				axisLine: { //指向外圈文本的分隔线样式
					lineStyle: {
						color: 'rgba(255, 255, 255, 0.5)'
					}
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(255, 255, 255, 0.5)', // 分隔线颜色
						width: 1, // 分隔线线宽
					}
				},
			},
			series: [{
				type: 'radar',
				symbolSize: 8,
				// symbol: 'angle',
				data: dataArr
			}]
		};
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
