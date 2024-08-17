<template>
	<div class="bg">
		<div class="bgHeader">{{ cityName }} 人口预测</div>
		<div class="body" style="display: flex;">
			<!-- 左侧 -->
			<div style="flex: 1;" id="leftChart">

			</div>
			<!-- 中间 -->
			<div style="flex: 2;" id="centerChart">

			</div>
			<!-- 右侧 -->
			<div style="flex: 1;" id="rightChart">

			</div>
		</div>
	</div>
	<Chart></Chart>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import Chart from '../../screen/components/chat/chat.vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import axios from 'axios';
import { useScreenStore } from '@/store'
const store = useScreenStore()

const route = useRoute()
let cityName = ref(route.query.cityName)
let leftData = ref()
let rightData = ref()
let angle = 0;//角度，用来做简单的动画效果的
let year=ref<string[]>([])
let peopleNumber=ref<string[]>([])
const getData = async () => {
	try {
		let res = await axios.get('/api/urbanrail/getcitypeoplenumber')
		if (res.status == 200) {
			// console.log("res", res)
			let data = res.data.filter(item => item.countryName == cityName.value)
			console.log("data", data)
			data.forEach(item => {
				if (item.year == 2030) {
					leftData.value = ((item.male / (item.male + item.female)) * 100).toFixed(2);
					rightData.value = ((item.cityNumber / (item.cityNumber + item.farmerNumber)) * 100).toFixed(2);
				}
				year.value.push(item.year)
				peopleNumber.value.push(item.peopleSum)
			})
			console.log("year",year.value)
			console.log("peopleNumber",peopleNumber.value)
			let contentYear=year.value.join(',')
			let contentPeopleNumber=peopleNumber.value.join(',')
			store.content=`${cityName.value}${contentYear}的总人数分别是${contentPeopleNumber}，其中预计2023年男女比例为${leftData.value}%，2023年城乡人口比例为${leftData.value}%,请你帮我对未来的轨道交通情况提一些有利于轨道交通发展的建议，以及根据${cityName.value}的实际情况对${cityName.value}未来的轨道交通走向趋势做出总结分析，不需要准确，但必须有理有据。`
			// console.log("store.content",store.content)

			setLeftChart()
			setRightChart()
			setCenterChart()

		}
	} catch (err) {
		console.log(err)
	}

}

onMounted(async () => {
	let leftChart = echarts.init(document.getElementById('leftChart'));
	let centerChart = echarts.init(document.getElementById('centerChart'));
	let rightChart = echarts.init(document.getElementById('rightChart'));
	console.log("leftData", leftData.value)
	console.log("rightData", rightData.value)
	await getData()
	// console.log("leftChart",leftChart)
	// console.log("centerChart",centerChart)
	// console.log("rightChart",rightChart)
	//中间的图表
	centerChart.setOption(centerOption.value, true)
	const leftDraw = () => {
		angle = angle + 3
		leftChart.setOption(leftOption.value, true)
		rightChart.setOption(rightOption.value, true)
	}

	setInterval(() => {
		leftDraw()
	}, 100);

})

//左侧的图标


let leftOption = ref()
let rightOption = ref()
let centerOption = ref()

const setLeftChart = () => {
	leftOption.value = {
		title: {
			text: '{a|' + leftData.value + '}{c|%}',
			x: 'center',
			y: 'center',
			textStyle: {
				rich: {
					a: {
						fontSize: 38,
						color: '#29EEF3'
					},

					c: {
						fontSize: 20,
						color: '#ffffff',
						// padding: [5,0]
					}
				}
			}
		},
		legend: {
			type: "plain",
			orient: "vertical",
			right: 15,
			top: "25%",
			align: "auto",
			data: [{
				name: '2030年男女比例',
				icon: "circle"
			},],
			textStyle: {
				color: "white",
				fontSize: 16,
				padding: [10, 1, 10, 0]
			},
			selectedMode: false
		},
		series: [
			{
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
							startAngle: (0 + angle) * Math.PI / 180,
							endAngle: (90 + angle) * Math.PI / 180
						},
						style: {
							stroke: "#0CD3DB",
							fill: "transparent",
							lineWidth: 1.5
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
							startAngle: (180 + angle) * Math.PI / 180,
							endAngle: (270 + angle) * Math.PI / 180
						},
						style: {
							stroke: "#0CD3DB",
							fill: "transparent",
							lineWidth: 1.5
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
							startAngle: (270 + -angle) * Math.PI / 180,
							endAngle: (40 + -angle) * Math.PI / 180
						},
						style: {
							stroke: "#0CD3DB",
							fill: "transparent",
							lineWidth: 1.5
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
							startAngle: (90 + -angle) * Math.PI / 180,
							endAngle: (220 + -angle) * Math.PI / 180
						},
						style: {
							stroke: "#0CD3DB",
							fill: "transparent",
							lineWidth: 1.5
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					let x0 = api.getWidth() / 2;
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
							stroke: "#0CD3DB",//粉
							fill: "#0CD3DB"
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",  //绿点
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					let x0 = api.getWidth() / 2;
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
							stroke: "#0CD3DB",      //绿
							fill: "#0CD3DB"
						},
						silent: true
					};
				},
				data: [0]
			},
			{
				name: '2030年男女比例',
				type: 'pie',
				radius: ['58%', '45%'],
				silent: true,
				clockwise: true,
				startAngle: 90,
				z: 0,
				zlevel: 0,
				label: {
					normal: {
						position: "center",

					}
				},
				data: [{
					value: leftData.value,
					name: "",
					itemStyle: {
						normal: {
							color: { // 完成的圆环的颜色
								colorStops: [{
									offset: 0,
									color: '#4FADFD' // 0% 处的颜色
								}, {
									offset: 1,
									color: '#28E8FA' // 100% 处的颜色
								}]
							},
						}
					}
				},
				{
					value: 100 - leftData.value,
					name: "",
					label: {
						normal: {
							show: false
						}
					},
					itemStyle: {
						normal: {
							color: "#173164"
						}
					}
				}
				]
			},


		]
	}
}
const setRightChart = () => {
	rightOption.value = {
		title: {
			text: '{a|' + rightData.value + '}{c|%}',
			x: 'center',
			y: 'center',
			textStyle: {
				rich: {
					a: {
						fontSize: 38,
						color: '#29EEF3'
					},

					c: {
						fontSize: 20,
						color: '#ffffff',
						// padding: [5,0]
					}
				}
			}
		},

		legend: {
			type: "plain",
			orient: "vertical",
			right: 15,
			top: "25%",
			align: "auto",
			data: [{
				name: '2030年城乡人口比例',
				icon: "circle"
			}],
			textStyle: {
				color: "white",
				fontSize: 16,
				padding: [10, 1, 10, 0]
			},
			selectedMode: false
		},
		series: [
			{
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
							startAngle: (0 + angle) * Math.PI / 180,
							endAngle: (90 + angle) * Math.PI / 180
						},
						style: {
							stroke: "#0CD3DB",
							fill: "transparent",
							lineWidth: 1.5
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
							startAngle: (180 + angle) * Math.PI / 180,
							endAngle: (270 + angle) * Math.PI / 180
						},
						style: {
							stroke: "#0CD3DB",
							fill: "transparent",
							lineWidth: 1.5
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
							startAngle: (270 + -angle) * Math.PI / 180,
							endAngle: (40 + -angle) * Math.PI / 180
						},
						style: {
							stroke: "#0CD3DB",
							fill: "transparent",
							lineWidth: 1.5
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 2,
							cy: api.getHeight() / 2,
							r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
							startAngle: (90 + -angle) * Math.PI / 180,
							endAngle: (220 + -angle) * Math.PI / 180
						},
						style: {
							stroke: "#0CD3DB",
							fill: "transparent",
							lineWidth: 1.5
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					let x0 = api.getWidth() / 2;
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
							stroke: "#0CD3DB",//粉
							fill: "#0CD3DB"
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: "ring5",  //绿点
				type: 'custom',
				coordinateSystem: "none",
				renderItem: function (params, api) {
					let x0 = api.getWidth() / 2;
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
							stroke: "#0CD3DB",      //绿
							fill: "#0CD3DB"
						},
						silent: true
					};
				},
				data: [0]
			}, {
				name: '2030年城乡人口比例',
				type: 'pie',
				radius: ['58%', '45%'],
				silent: true,
				clockwise: true,
				startAngle: 90,
				z: 0,
				zlevel: 0,
				label: {
					normal: {
						position: "center",

					}
				},
				data: [
					{
						value: rightData.value,
						name: "",
						itemStyle: {
							normal: {
								color: { // 完成的圆环的颜色
									colorStops: [{
										offset: 0,
										color: '#4FADFD' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#28E8FA' // 100% 处的颜色
									}]
								},
							}
						}
					},
					{
						value: 100 - rightData.value,
						name: "",
						label: {
							normal: {
								show: false
							}
						},
						itemStyle: {
							normal: {
								color: "#173164"
							}
						}
					}
				]
			},

		],

	}
}
const setCenterChart = () => {
	centerOption.value = {
		"title": {
			"text": `${cityName.value}总人数`,
			x: "center",
			y: "4%",
			textStyle: {
				color: '#fff',
				fontSize: '18'
			},
			subtextStyle: {
				color: '#90979c',
				fontSize: '16',
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			top: '15%',
			right: '8	%',
			left: '13%',
			bottom: '12%'
		},
		xAxis: [{
			type: 'category',
			data: year.value,
			axisLine: {
				lineStyle: {
					color: 'rgba(255,255,255,0.12)'
				}
			},
			axisLabel: {
				margin: 10,
				color: '#e2e9ff',
				textStyle: {
					fontSize: 14
				},
			},
		}],
		yAxis: [{
			name: '单位：万人',
			axisLabel: {
				formatter: '{value}',
				color: '#e2e9ff',
			},
			axisLine: {
				show: false,
				lineStyle: {
					color: 'rgba(255,255,255,1)'
				}
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(255,255,255,0.12)'
				}
			}
		}],
		series: [
			{
			type: 'bar',
			data: peopleNumber.value,
			barWidth: '20px',
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: 'rgba(0,244,255,1)' // 0% 处的颜色
					}, {
						offset: 1,
						color: 'rgba(0,77,167,1)' // 100% 处的颜色
					}], false),
					barBorderRadius: [30, 30, 30, 30],
					shadowColor: 'rgba(0,160,221,1)',
					shadowBlur: 4,
				}
			},
			label: {
				normal: {
					show: true,
					lineHeight: 30,
					width: 80,
					height: 30,
					backgroundColor: 'rgba(0,160,221,0.1)',
					borderRadius: 200,
					position: ['-8', '-60'],
					distance: 1,
					formatter: [
						'    {d|●}',
						' {a|{c}}     \n',
						'    {b|}'
					].join(','),
					rich: {
						d: {
							color: '#3CDDCF',
						},
						a: {
							color: '#fff',
							align: 'center',
						},
						b: {
							width: 1,
							height: 30,
							borderWidth: 1,
							borderColor: '#234e6c',
							align: 'left'
						},
					}
				}
			}
		}]
	}
}
//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
const getCirlPoint = (x0, y0, r, angle) => {
	let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
	let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
	return {
		x: x1,
		y: y1
	}
}





</script>
<style lang='scss' scoped>
.bg {
	background-color: #020712;
	margin: 0;
	font-family: "Microsoft YaHei";
	font-weight: lighter;
	background-image: url("/src/assets/images/peopleNumber/Homebodybg.png");
	background-repeat: no-repeat;
	background-position: center;
	background-position-y: -120px;
	width: 100vw;
	height: 100vh
}

.bgHeader {
	width: 686px;
	height: 69px;
	margin: auto;
	background-image: url("/src/assets/images/peopleNumber/Hometitlebg.png");
	background-repeat: no-repeat;
	background-position: center;
	text-align: center;
	font-weight: bold;
	font-size: 18px;
	line-height: 69px;
	color: #00e4ff
}

.body {
	width: 100vw;
	height: calc(100% - 69px);
}
</style>
