<template>
	<div class="bg">
		<div class="header">
			<div class="header-left fl" id="time"></div>
			<div class="header-center fl">
				<div class="header-title">
					{{ cityName }} 交通情况预测
				</div>
				<div class="header-img"></div>
			</div>
			<div class="header-right fl"></div>
			<div class="header-bottom fl"></div>

		</div>
		<div class="body" style="display: flex;">
			<div style="flex: 1;">
				<div style="width: 100%;height: 20%;justify-content: center;">
					<div style="width: 300px;height: 100%;margin: 0 auto;display: flex;">
						<div style="flex: 1;">
							<svg width="100%" height="100%">
								<image href="/src/assets/svg/轨道交通.png" width="100%" height="100%" />
							</svg>
						</div>
						<div style="flex: 2;">
							<span
								style="display: block;height: 60px;color: #fff;text-align: center; line-height:60px;font-weight: 600;font-size: 20px;">当前轨道交通线路数</span>
							<div style="color: #fff;width: 100%;height: 40px;text-align: center; vertical-align: center;"><span style="height: 40px;line-height: 40px;display: inline-block;font-size: 42px;font-weight: 600;">{{ currentTraffic }}</span>
							</div>
						</div>
					</div>
				</div>
				<div id="leftChart" style="width: 100%;height: 80%;">

				</div>
			</div>
			<div id="rightChart" style="flex: 1;"></div>
		</div>
	</div>
	<Chart></Chart>
</template>

<script setup >
import { onMounted, ref } from 'vue'
import Chart from '../../screen/components/chat/chat.vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import axios from 'axios';
import { useScreenStore } from '@/store'
const store = useScreenStore()

const route = useRoute()
let cityName = ref(route.query.cityName)
let yearTraffic = ref([])
let trafficMile = ref([])
let yearTrafficOperator = ref([])
let railway = ref([])
let hightSpeed = ref([])
let currentTraffic=ref()
const getData = async () => {
	try {
		let res = await axios.get('/api/urbanrail/getcitytraffic')
		if (res.status == 200) {
			let data = res.data.filter(item => item.country == cityName.value)
			console.log("data", data)
			data.forEach(item => {
				console.log("item", item)
				if (item.trafficChoice == "运营里程") {
					console.log("data", item)
					yearTraffic.value?.push(item.year)
					trafficMile.value.push(item.mileage)
				}
				if (item.trafficChoice != "运营里程" && item.trafficChoice != '当前轨道交通数') {
					console.log("data", item)
					yearTrafficOperator.value?.push(item.year)
					if (item.trafficChoice == '铁路里程') {
						railway.value.push(item.mileage)
					}
					if (item.trafficChoice == '高速（城际铁路）') {
						hightSpeed.value.push(item.mileage)
					}
				}
				if(item.trafficChoice=='当前轨道交通数'){
					currentTraffic.value=item.mileage
				}
				// economicNum.value?.push(item.economics)
				// economicTraffic.value?.push(item.traffic)
			})
			yearTrafficOperator.value = Array.from(new Set(yearTrafficOperator.value)).sort((a, b) => a - b);
			railway.value=railway.value.sort((a, b) => a - b)
			hightSpeed.value=hightSpeed.value.sort((a, b) => a - b)

			let contentYear=yearTraffic.value.join(',')//运营里程
			let contentTrafficMile=trafficMile.value.join(',')

			let contentYearTrafficOperator=yearTrafficOperator.value.join(',')//轨道交通积累运行
			let contentRailway=railway.value.join(',')//铁路
			let contentHightSpeed=hightSpeed.value.join(',')//城际铁路


			store.content=`${cityName.value}${contentYear}的运营里程数分别是${contentTrafficMile}，${contentYearTrafficOperator}年的铁路轨道交通积累运行公里数分别是${contentRailway},与之相对应年份的城际铁路轨道交通积累运行公里数分别是${contentHightSpeed},${cityName.value}当前轨道交通线路数为${currentTraffic.value}。请你帮我对未来的轨道交通情况提一些有利于轨道交通发展的建议，以及根据${cityName.value}的实际情况对${cityName.value}未来的轨道交通走向趋势做出总结分析，不需要准确，但必须有理有据。`
			console.log("store.content",store.content)

			setLeftOption()
			setRightOption()
		}
		// setChartOption()
	}
	catch (err) {
		console.log(err)
	}
}

onMounted(async () => {
	let leftChart = echarts.init(document.getElementById('leftChart'));
	let rightChart = echarts.init(document.getElementById('rightChart'));
	await getData()
	rightChart.setOption(rightOption.value, true)
	leftChart.setOption(leftOption.value, true)
})

//左侧的chart表格
var name = ["铁路里程（公里）", "高速里程（城际铁路,公里）"];
let leftOption = ref()
const setLeftOption = () => {
	leftOption.value = {
		tooltip: {
			trigger: 'item',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'line' // 默认为直线，可选为：'line' | 'shadow'
			},
			textStyle: {
				fontSize: 24
			}
		},
		"legend": {
			"left": "25%",
			"top": "5%",
			"show": true,
			"type": "scroll",
			"data": name,
			"itemWidth": 20,
			"itemHeight": 15,
			"itemGap": 30,
			"textStyle": {
				"fontSize": 20,
				"color": "#fff",
				"fontFamily": "Microsoft YaHei"
			},
		},
		"grid": [{
			"left": "10%",
			"right": "53%",
			"top": 60,
			"bottom": "30"
		}, {
			"left": "57%",
			"right": "10%",
			"top": 60,
			"bottom": "30"
		}, {
			"left": "0%",
			"right": "0%",
			"top": 0,
			"bottom": "0"
		}],
		"xAxis": [{
			"type": "value",
			"gridIndex": 0,
			"inverse": true,
			"axisLine": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "red"
				}
			},
			"splitLine": {
				"show": false,
				"lineStyle": {
					"type": "dotted",
					"color": "#ccc",
					"width": 1
				}
			},
			"axisTick": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "#fff"
				}
			},
			"axisLabel": {
				"show": false,
				"fontFamily": "Microsoft YaHei",
				"fontSize": 20,
				"color": "fff",
				"interval": "auto",
				"rotate": "0",
			},
			"data": [],
		}, {
			"type": "value",
			"gridIndex": 1,
			"inverse": false,
			"axisLine": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "red"
				}
			},
			"splitLine": {
				"show": false,
				"lineStyle": {
					"type": "dotted",
					"color": "red",
					"width": 1
				}
			},
			"axisTick": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "red"
				}
			},
			"axisLabel": {
				"show": false,
				"fontFamily": "Microsoft YaHei",
				"fontSize": 12,
				"color": "#fff",
				"interval": "auto",
				"rotate": "0"
			},
			"data": [],
			"offset": 400
		}, {
			"type": "value",
			"gridIndex": 2,
			"inverse": false,
			"axisLine": { //只有这个
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "red"
				}
			},
			"splitLine": {
				"show": false,
				"lineStyle": {
					"type": "dotted",
					"color": "#ccc",
					"width": 1
				}
			},
			"axisTick": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "red"
				}
			},
			"axisLabel": {
				"show": false,
				"fontFamily": "Microsoft YaHei",
				"fontSize": 12,
				"color": "red",
				"interval": "auto",
				"rotate": "0"
			},
			"data": [],
		}],
		"yAxis": [{
			"type": "category",
			"axisLine": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "#d6dfe5"
				}
			},
			"splitLine": {
				"show": false,
				"lineStyle": {
					"type": "dotted",
					"color": "#ccc",
					"width": 1
				}
			},
			"axisTick": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "#888888"
				}
			},
			"axisLabel": {
				"show": true,
				"fontFamily": "Microsoft YaHei",
				"fontSize": 16,
				"color": "#ffffff",
				"interval": "auto"
			},
			"data": yearTrafficOperator.value,
			// "data": [],
			"position": "right"
		}, {
			"type": "category",
			"gridIndex": 1,
			"axisLine": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "#888888"
				}
			},
			"splitLine": {
				"show": false,
				"lineStyle": {
					"type": "dotted",
					"color": "#ccc",
					"width": 1
				}
			},
			"axisTick": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "#888888"
				}
			},
			"axisLabel": {
				"show": false,
				"fontFamily": "Microsoft YaHei",
				"fontSize": 12,
				"color": "#fff",
				"interval": "auto"
			},
			"data": [],

		}, {
			"type": "category",
			"gridIndex": 2,
			"axisLine": {
				"show": false,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "#888888"
				}
			},
			"splitLine": {
				"show": false,
				"lineStyle": {
					"type": "dotted",
					"color": "#ccc",
					"width": 1
				}
			},
			"axisTick": {
				"show": true,
				"lineStyle": {
					"width": 1,
					"type": "solid",
					"color": "#888888"
				}
			},
			"axisLabel": {
				"show": true,
				"fontFamily": "Microsoft YaHei",
				"fontSize": 20,
				"color": "#777575",
				"interval": "auto"
			}
		}],
		"series": [{
			"colId": "col402utokg",
			"name": name[0],
			"type": "bar",
			"data": railway.value,
			barWidth: 15,
			color: '#00f3df',
			"xAxisIndex": 0,
			"yAxisIndex": 0,
			itemStyle: {
				normal: {
					barBorderRadius: [10, 10, 10, 10],
					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						offset: 0,
						color: 'rgba(43,163,205,1)'
					},
					{
						offset: 1,
						color: "rgba(43,163,205,0)"
					}
					])
				}
			},
			"label": {
				"position": "left",
				"fontFamily": "Microsoft YaHei",
				"show": true,
				"fontSize": 20,
				"color": "#fff"
			}
		}, {
			"colId": "col3kkgr6h9",
			"name": name[1],
			"type": "bar",
			"data": hightSpeed.value,
			barWidth: 15,
			color: '#01b3e0',
			"xAxisIndex": 1,
			"yAxisIndex": 1,
			itemStyle: {
				normal: {
					barBorderRadius: [10, 10, 10, 10],
					color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
						offset: 0,
						color: "rgba(140,113,246,1)"
					},
					{
						offset: 1,
						color: "rgba(140,113,246,0)"
					}
					])
				}
			},
			"label": {
				"position": "right",
				"fontFamily": "Microsoft YaHei",
				"show": true,
				"fontSize": 20,
				"color": "#fff",

			}
		}],
	}
}
//右侧的


var rightOption = ref()

const setRightOption = () => {
	var data1 = [14, 15, 65, 24, 75, 23, 24, 43, 27, 72, 12, 53];
	var data2 = trafficMile.value;
	var json = {
		chart0: {
			xcategory: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			low: data1,
			lowLine: [],
		}
	};
	var json2 = {
		chart0: {
			xcategory: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			low: data2,
			lowLine: [],
		}
	};
	var zrUtil = echarts.util;
	zrUtil.each(json.chart0.xcategory, function (item, index) {
		json.chart0.lowLine.push([{
			coord: [index, json.chart0.low[index]]
		}, {
			coord: [index + 1, json.chart0.low[index + 1]]
		}]);
	});
	zrUtil.each(json.chart0.xcategory, function (item, index) {
		json2.chart0.lowLine.push([{
			coord: [index, json2.chart0.low[index]]
		}, {
			coord: [index + 1, json2.chart0.low[index + 1]]
		}]);
	});
	console.log("json2", json2)

	rightOption.value = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				lineStyle: {
					color: '#fff'
				}
			},
			backgroundColor: 'rgba(0,0,0,.8)',
			extraCssText: 'box-shadow: 4px 4px 10px rgba(21, 250, 255,.6);color: #fff;',
			formatter: function (params) {
				var result = params[0].name + '<br>';
				params.forEach(function (item) {
					result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;color: #fff;height:9px;background-color:' + item.color + '"></span>';
					// 判断设置增长还是降低
					if (parseFloat(item.data) >= 50) {
						result += item.seriesName + ": " + '<span class="growth" style="color: #fff;">' + item.data + "</span><br>"
					} else if (parseFloat(item.data) < 50) {
						result += item.seriesName + ": " + '<span class="reduce">降低' + item.data + "%</span><br>"
					}
				});
				return result;
			}
		},
		legend: {
			data: ['运营里程', '环比'],
			textStyle: {
				fontSize: 12,
				color: 'rgb(0,253,255,0.6)'
			},
			top: '5%',
			right: '5%'
		},
		grid: {
			bottom: 50,
			left: 70,
			right: 50,
		},
		xAxis: {
			axisLine: {
				show: true,
				lineStyle: {
					color: '#15faff',
				},

			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: true
			},
			data: yearTraffic.value,
		},
		yAxis: {
			// min: 300,
			splitNumber: 4,
			interval: 25,
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false
			},
			splitLine: {
				lineStyle: {
					type: 'dashed',
					color: '#4b4d64'
				}
			},
			axisLabel: {
				formatter: '{value} ',
				textStyle: { //改变刻度字体样式
					color: '#ffffff'
				}
			},
		},
		series: [
			{
				name: '运营里程',
				type: 'line',
				// smooth: true,
				symbol: 'circle',
				symbolSize: 10,
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(21, 250, 255,.9)'
						}, {
							offset: 0.8,
							color: 'rgba(6, 8, 41,.1)'
						}], false),
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						shadowBlur: 10
					}
				},
				itemStyle: {
					normal: {
						color: '#15faff'
					}
				},
				data: data2
			},
			{
				name: '运营里程',
				type: 'lines',
				coordinateSystem: 'cartesian2d',
				zlevel: 1,
				smooth: true,
				symbol: 'circle',
				effect: {
					show: true,
					smooth: true,
					period: 2,
					symbolSize: 8
				},
				lineStyle: {
					normal: {
						color: '#15faff',
						width: 0,
						opacity: 0,
						curveness: 0,
					}
				},
				data: json2.chart0.lowLine
			},
		]
	}
}

</script>
<style lang='scss' scoped>
.bg {
	background: url("/src/assets/images/traffic/bg01.png") no-repeat center;
	width: 100vw;
	height: 100vh;
	background-attachment: fixed;
	-webkit-background-size: cover;
	position: relative;
}

.header {
	width: 100%;
	height: 80px;
	/*background: red;*/

}

.header .header-left {
	width: 25%;
	height: 80px;
	color: white;
	/*    border: 1px solid green;*/
	text-align: center;
	height: 80px;
}

.header .header-center {
	width: 50%;
	height: 80px;
	/*border: 1px solid red;*/
	/*    background: url("../images/head.gif") no-repeat;
    background-size: 100% 100%;*/
	position: relative;
}

.header .header-center .header-title {
	text-align: center;
	color: #ffffff;
	font-size: 22px;
	text-shadow: 0 0 .3rem #00d8ff;
	height: 80px;
}

.header .header-img {
	background: url("/src/assets/images/traffic/head.gif") no-repeat center center;
	background-size: 100%;
	height: 100%;
	width: 100%;
	position: absolute;
	top: .4rem;
}

.header .header-right {
	width: 25%;
	height: 80px;
	/*border: 1px solid gold;*/
}

.header .header-bottom {
	width: calc(100% - .4rem);
	height: .16rem;
	background: url("/src/assets/images/traffic/header.png") no-repeat;
	background-size: calc(100% - .2rem) 100%;
	padding: 0 .2rem;
	margin-left: .3rem;

}

.fl {
	float: left;
}

.fr {
	float: right;
}

.body {
	width: 100vw;
	height: calc(100% - 90px);
	// background-color: #fff;
}
</style>
