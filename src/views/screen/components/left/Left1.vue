<template>
	<div class="es-block">
		<Title>全国1~12个月运营数据</Title>
		<div style="width: 100%;height: 90%;">
			<Chart :option="option" />
		</div>
	</div>
</template>

<script setup >
import { ref, reactive, onMounted } from 'vue'
import Title from '../Title.vue'
import Chart from '@/components/chart/Chart.vue'
import allData from '@/assets/data/trend.json'
import * as echarts from 'echarts'
import axios from "axios";

const chartData = reactive({
	mapData: [],
	data: [],
	passeneger: [],
	growRate: []
})
const getData = async () => {
	let res = await axios.get('/api/urbanrail/monthlist')
	if (res.status == 200) {
		let data = res.data
		chartData.mapData = data.sort((a, b) => a.month - b.month);
		chartData.mapData.forEach(item => {
			chartData.data.push(item.month)
			chartData.passeneger.push(item.passeneger)
			chartData.growRate.push(item.growRate)
		});
		option.value = {
			tooltip: {},
			grid: {
				top: '8%',
				left: '0%',
				right: '0%',
				bottom: '0%',
				containLabel: true,
			},
			legend: {
				itemGap: 50, // 设置图例每项之间的间距
				data: ['客运量(万人)', '同比增速'], // 图例的数据项
				textStyle: {
					color: '#f9f9f9', // 设置字体颜色
					borderColor: '#fff', // 设置边框颜色
					fontSize: 18, // 设置字体大小
				},
			},
			xAxis: [{
				type: 'category',
				boundaryGap: true,
				axisLine: { //坐标轴轴线相关设置。数学上的x轴
					show: true,
					lineStyle: {
						color: '#f9f9f9'
					},
				},
				axisLabel: { //坐标轴刻度标签的相关设置
					textStyle: {
						color: '#d1e6eb',
						margin: 15,
					},
				},
				axisTick: {
					show: false,
				},
				data: chartData.data,
			}],
			yAxis: [
				{
					type: 'value',
					position: 'right',
					min: -25,
					max: 10,
					splitNumber: 6,
					splitLine: {
						show: true,
						lineStyle: {
							color: '#0a3256'
						}
					},
					axisLine: {
						show: false,
					},
					axisLabel: {
						textStyle: {
							color: '#d1e6eb',
						},
					},
					axisTick: {
						show: false,
					},
				},
				{
					type: 'value',
					position: 'left',
					min: 0,
					max: 300000,
					splitNumber: 6,
					splitLine: {
						show: true,
						lineStyle: {
							color: '#0a3256'
						}
					},
					axisLine: {
						show: false,
					},
					axisLabel: {
						textStyle: {
							color: '#d1e6eb',
						},
					},
					axisTick: {
						show: false,
					},
				}
			],
			series: [{
				name: '同比增速',
				yAxisIndex: 0,
				type: 'line',
				showAllSymbol: true,
				symbol: 'emptyCircle',
				symbolSize: 6,
				lineStyle: {
					normal: {
						color: "#28ffb3", // 线条颜色
					},
					borderColor: '#f0f'
				},
				label: {
					show: true,
					position: 'top',
					textStyle: {
						color: '#fff',
					}
				},
				itemStyle: {
					normal: {
						color: "#28ffb3",

					}
				},
				tooltip: {
					show: true
				},
				areaStyle: { //区域填充样式
					normal: {
						//线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(0,154,120,1)'
						},
						{
							offset: 1,
							color: 'rgba(0,0,0, 0)'
						}
						], false),
						shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
						shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
					}
				},
				data: chartData.growRate
			}, {
				name: '客运量(万人)',
				yAxisIndex: 1,
				type: 'bar',
				barWidth: 20,
				tooltip: {
					show: true
				},
				label: {
					show: true,
					position: 'top',
					textStyle: {
						color: '#fff',
					}
				},
				itemStyle: {
					normal: {
						color: function (params) {
							var colorList = ['#0ec1ff', '#10cdff', '#12daff', '#15ebff', '#17f8ff', '#1cfffb', '#1dfff1', '#0ec1ff', '#10cdff', '#12daff', '#15ebff', '#17f8ff'];
							return colorList[params.dataIndex];
						}
					}
				},
				data: chartData.passeneger
			}]
		}
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
