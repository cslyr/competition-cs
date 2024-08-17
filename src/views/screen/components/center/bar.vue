<template>
	<div class="es-block">
		<Title>轨道交通线路长度</Title>
		<div style="width: 100%;height: 98%;">
			<div id="bar" style="width: 100%;height: 98%;padding-left: 200px;background-color: #222835"></div>
		</div>
	</div>
</template>

<script setup >
import { ref, onMounted, reactive } from 'vue'
import Title from '../Title.vue'
import * as echarts from 'echarts'
import axios from "axios";

const chartData = reactive({
	data: [],
	lastData: []
})


let data = ref([])
let data2 = ref([])

let option = ref()
let angle = 0;//角度，用来做简单的动画效果的
onMounted(() => {
	let myChart = echarts.init(document.getElementById('bar'));
	const getData = async () => {
		let res = await axios.get('/api/urbanrail/constructprogress')
		if (res.status == 200) {
			let getData = res.data
			// console.log("data", data)
			getData.forEach(item => {
				if (item.region == '全 国' && item.constructProgress == "established") {
					chartData.data.push(item)
				}
			})
			chartData.lastData.push(
				{
					name: '地铁线路长度',
					value: chartData.data[0]['subwayLine']
				},
				{
					name: '轻轨线路长度',
					value: chartData.data[0]['lightrailLine']
				},
				{
					name: '单轨线路长度',
					value: chartData.data[0]['monorailLine']
				},
				{
					name: '有轨线路长度',
					value: chartData.data[0]['cablecarLine']
				},
				{
					name: '磁浮线路长度',
					value: chartData.data[0]['maglevLine']
				},
				{
					name: '快轨线路长度',
					value: chartData.data[0]['fasttrackLine']
				},
				{
					name: 'APM线路长度',
					value: chartData.data[0]['apmLine']
				}
			)

			var color = ['#2A8BFD', '#BAFF7F', '#00FAC1', '#00CAFF', '#FDE056', '#4ED33C', '#FF8A26', '#FF5252', '#9689FF', '#CB00FF']
			for (var i = 0; i < chartData.lastData.length; i++) {
				data.value.push({//内部的数据
					value: chartData.lastData[i].value,
					name: chartData.lastData[i].name,
					itemStyle: {
						normal: {
							borderWidth: 8,
							shadowBlur: 20,
							borderRadius: 20,
							borderColor: color[i],
							shadowColor: color[i]
						}
					}
				}, {
					value: 500,
					name: '',
					itemStyle: {
						normal: {
							label: {
								show: false
							},
							labelLine: {
								show: false
							},
							color: 'rgba(0, 0, 0, 0)',
							borderColor: 'rgba(0, 0, 0, 0)',
							borderWidth: 0

						}
					}
				});
				data2.value.push({//外部的数据
					value: chartData.lastData[i].value,
					name: chartData.lastData[i].name,
				},
					{
						value: 500,
						name: '',
						itemStyle: {
							normal: {
								label: {
									show: false
								},
								labelLine: {
									show: false
								},
								color: 'rgba(0, 0, 0, 0)',
								borderColor: 'rgba(0, 0, 0, 0)',
								borderWidth: 0,
								opacity: 0.2

							}
						}
					}
				)
			}
			option.value = {
				color: color,
				tooltip: {
					show: true
				},
				legend: {
					right: '10%',
					top: '5%',
					icon: 'rect',
					itemWidth: 15,
					itemHeight: 15,
					textStyle: {
						color: '#ffffff',
						fontSize: 16
					}
				},
				series: [
					{//外线1
						name: "",
						type: 'custom',
						coordinateSystem: "none",
						renderItem: function (params, api) {
							return {
								type: 'arc',
								shape: {
									cx: api.getWidth() / 3,
									cy: api.getHeight() / 2,
									r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
									startAngle: (0 + angle) * Math.PI / 180,
									endAngle: (90 + angle) * Math.PI / 180
								},
								style: {
									stroke: '#4EE9E6',
									fill: "transparent",
									lineWidth: 1.5
								},
								silent: true
							};
						},
						data: [0]
					},
					{//内线1
						name: "",
						type: 'custom',
						coordinateSystem: "none",
						renderItem: function (params, api) {
							return {
								type: 'arc',
								shape: {
									cx: api.getWidth() / 3,
									cy: api.getHeight() / 2,
									r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
									startAngle: (180 + angle) * Math.PI / 180,
									endAngle: (270 + angle) * Math.PI / 180
								},
								style: {
									stroke: "#4EE9E6",
									fill: "transparent",
									lineWidth: 1.5
								},
								silent: true
							};
						},
						data: [0]
					},
					{//外线2
						name: "",
						type: 'custom',
						coordinateSystem: "none",
						renderItem: function (params, api) {
							return {
								type: 'arc',
								shape: {
									cx: api.getWidth() / 3,
									cy: api.getHeight() / 2,
									r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
									startAngle: (270 + -angle) * Math.PI / 180,
									endAngle: (40 + -angle) * Math.PI / 180
								},
								style: {
									stroke: "#4EE9E6",
									fill: "transparent",
									lineWidth: 1.5
								},
								silent: true
							};
						},
						data: [0]
					},
					{//外线2
						name: "",
						type: 'custom',
						coordinateSystem: "none",
						renderItem: function (params, api) {
							return {
								type: 'arc',
								shape: {
									cx: api.getWidth() / 3,
									cy: api.getHeight() / 2,
									r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
									startAngle: (90 + -angle) * Math.PI / 180,
									endAngle: (220 + -angle) * Math.PI / 180
								},
								style: {
									stroke: "#4EE9E6",
									fill: "transparent",
									lineWidth: 1.5
								},
								silent: true
							};
						},
						data: [0]
					},
					{//绿点1
						name: "",
						type: 'custom',
						coordinateSystem: "none",
						renderItem: function (params, api) {
							let x0 = api.getWidth() / 3;
							let y0 = api.getHeight() / 2;
							let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
							let point = getCirlPoint(x0, y0, r, (90 + -angle))
							return {
								type: 'circle',
								shape: {
									cx: point.x,
									cy: point.y,
									r: 4
								},
								style: {
									stroke: "#66FFFF",//粉
									fill: "#66FFFF"
								},
								silent: true
							};
						},
						data: [0]
					},
					{//绿点2
						name: "",  //绿点
						type: 'custom',
						coordinateSystem: "none",
						renderItem: function (params, api) {
							let x0 = api.getWidth() / 3;
							let y0 = api.getHeight() / 2;
							let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
							let point = getCirlPoint(x0, y0, r, (270 + -angle))
							return {
								type: 'circle',
								shape: {
									cx: point.x,
									cy: point.y,
									r: 4
								},
								style: {
									stroke: "#66FFFF",//粉
									fill: "#66FFFF"
								},
								silent: true
							};
						},
						data: [0]
					},
					{//绿点3
						name: "",
						type: 'custom',
						coordinateSystem: "none",
						renderItem: function (params, api) {
							let x0 = api.getWidth() / 3;
							let y0 = api.getHeight() / 2;
							let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6;
							let point = getCirlPoint(x0, y0, r, (90 + angle))
							return {
								type: 'circle',
								shape: {
									cx: point.x,
									cy: point.y,
									r: 4
								},
								style: {
									stroke: "#66FFFF",//粉
									fill: "#66FFFF"
								},
								silent: true
							};
						},
						data: [0]
					},
					{//绿点4
						name: "",  //绿点
						type: 'custom',
						coordinateSystem: "none",
						renderItem: function (params, api) {
							let x0 = api.getWidth() / 3;
							let y0 = api.getHeight() / 2;
							let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6;
							let point = getCirlPoint(x0, y0, r, (270 + angle))
							return {
								type: 'circle',
								shape: {
									cx: point.x,
									cy: point.y,
									r: 4
								},
								style: {
									stroke: "#66FFFF",//粉
									fill: "#66FFFF"
								},
								silent: true
							};
						},
						data: [0]
					},
					{
						name: '',
						type: 'pie',
						clockWise: false,
						radius: ['98%', '95%'],
						hoverAnimation: false,
						center: ['33.33%', '50%'],
						top: "center",
						itemStyle: {
							normal: {
								label: {
									show: false
								}
							}
						},
						data: data.value
					},
					{
						type: 'pie',
						top: "center",
						startAngle: 90,
						clockwise: false,
						center: ['33.33%', '50%'],
						legendHoverLink: false,
						hoverAnimation: false,
						radius: ['94%', '55%'],
						itemStyle: {
							opacity: 0.15
						},
						label: {
							show: false,
							position: 'center'
						},
						labelLine: {
							show: false
						},
						data: data2.value
					},
					{
						name: '',
						type: 'pie',
						clockWise: false,
						center: ['33.33%', '50%'],
						radius: ['39%', '38%'],
						hoverAnimation: false,
						top: "center",
						itemStyle: {
							normal: {
								label: {
									show: false
								}
							}
						},
						data: data.value
					},
				]
			}
			//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
			function getCirlPoint(x0, y0, r, angle) {
				let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
				let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
				return {
					x: x1,
					y: y1
				}
			}

			function draw() {
				angle = angle + 3
				myChart.setOption(option.value, true);
				//window.requestAnimationFrame(draw);
			}

			let intervalOne = setInterval(function () {
				//用setInterval做动画感觉有问题
				draw()
			}, 100);
			setTimeout(function () {
				if (intervalOne) {
					clearInterval(intervalOne);
				}
			}, 25000);
			myChart.setOption(option.value, true);
		}
	}
	getData()


});







</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
}
</style>
