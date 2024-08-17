<template>
	<div class="bg">
		<div class="bgHeader">
			<header id="header">
				<div class="header">
					<h1>{{ cityName }} 经济预测</h1>
				</div>
			</header>
		</div>
		<div class="body" style="display: flex;">
			<div id="chart" style="flex: 1;"></div>
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
let economicNum = ref<string[]>([])
let year = ref<string[]>([])
let economicTraffic = ref<string[]>([])

const getData = async () => {
	try {
		let res = await axios.get('/api/urbanrail/getcityeconomics')
		if (res.status == 200) {
			let data = res.data.filter(item => item.province == cityName.value)
			console.log("data", data)

			data.forEach(item => {
				console.log("item", item)
				year.value?.push(item.year)
				economicNum.value?.push(item.economics)
				economicTraffic.value?.push(item.traffic)
			})
			let contentYear=year.value.join(',')
			let contentEconomics=economicNum.value.join(',')
			let contentTraffic=economicTraffic.value.join(',')
			store.content=`${cityName.value}${contentYear}的总经济收入分别是${contentEconomics}，其中在轨道交通上的投入分别是${contentTraffic},单位是亿元根据我上述的数据，请你帮我对${cityName.value}未来的轨道交通情况提一些有利于轨道交通发展的建议，以及根据${cityName.value}的实际情况对${cityName.value}未来的轨道交通走向趋势做出总结分析，不需要准确，但必须有理有据。`
			console.log("store.content",store.content)
		}
		setChartOption()
	}
	catch (err) {
		console.log(err)
	}
}

onMounted(async () => {
	let myChart = echarts.init(document.getElementById('chart'));
	await getData()
	// //中间的图表
	myChart.setOption(option.value, true)
})

let option = ref()
const setChartOption = () => {
	option.value = {
		title: {
			text: '',
			textStyle: {
				align: 'center',
				color: '#fff',
				fontSize: 20,
			},
			top: '3%',
			left: '10%',
		},
		grid: {
			top: "25%",
			bottom: "10%"//也可设置left和right设置距离来控制图表的大小
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow",
				label: {
					show: true
				}
			}
		},
		legend: {
			data: ["总经济收入", "轨道交通经济投入"],
			top: "15%",
			textStyle: {
				color: "#ffffff"
			}
		},
		xAxis: {
			data: year.value,
			axisLine: {
				show: true, //隐藏X轴轴线
				lineStyle: {
					color: '#01FCE3'
				}
			},
			axisTick: {
				show: true //隐藏X轴刻度
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: "#ebf8ac" //X轴文字颜色
				}
			},

		},
		yAxis: [{
			type: "value",
			name: "亿元",
			nameTextStyle: {
				color: "#ebf8ac"
			},
			splitLine: {
				show: false
			},
			axisTick: {
				show: true
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#FFFFFF'
				}
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: "#ebf8ac"
				}
			},

		},

		{
			type: "value",
			gridIndex: 0,
			splitNumber: 8,
			splitLine: {
				show: false
			},
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			},
			splitArea: {
				show: true,
				areaStyle: {
					color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
				}
			}
		}
		],
		series: [{
			name: "总经济收入",
			type: "line",
			yAxisIndex: 0, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
			smooth: true, //平滑曲线显示
			showAllSymbol: true, //显示所有图形。
			symbol: "circle", //标记的图形为实心圆
			symbolSize: 10, //标记的大小
			itemStyle: {
				//折线拐点标志的样式
				color: "#058cff"
			},
			lineStyle: {
				color: "#058cff"
			},
			areaStyle: {
				color: "rgba(5,140,255, 0.2)"
			},
			data: economicNum.value
		},
		{
			name: "轨道交通经济投入",
			type: "bar",
			// yAxisIndex: 0, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
			barWidth: 15,
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: "#00FFE3"
					},
					{
						offset: 1,
						color: "#4693EC"
					}
					])
				}
			},
			data: economicTraffic.value
		}
		]
	}
}


</script>
<style lang='scss' scoped>
.bg {
	background: url("/src/assets/images/economic/bj.png") no-repeat center;
	width: 100vw;
	height: 100vh;
	background-attachment: fixed;
	-webkit-background-size: cover;
}

.bgHeader {
	width: 100%;
	height: 105px;
	position: relative;
	/*border-bottom: 1px solid #00fbfe;*/
	background: url("/src/assets/images/economic/head_bg.png") no-repeat center center;
	background-size: 100%;
	// box-shadow: 0 0 25px #037581;
	min-width: 1366px;
}

#header .header {
	width: 400px;
	height: 105px;
	/*background: red;*/
	margin: 0 auto;
	text-align: center;
	line-height: 80px;
	font-size: 24px;

}

#header .header h1 {
	color: #ffffff;
	text-shadow: 0 0 25px #00d8ff;
	font-size: 46px;
	font-family: "Adobe 楷体 Std R";
}

.body {
	width: 100vw;
	height: calc(100% - 105px);
	// background-color: #fff;
}
</style>
