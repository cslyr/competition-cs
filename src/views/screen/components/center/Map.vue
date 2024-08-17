<template>
	<div class="es-block">
		<!-- <Title>商家分布</Title> -->
		<div style="width: 100%;height: 98%;">
			<!-- <Chart :option="option" /> -->
			<div style="width: 100%;height: 100%;">
				<div id="map" style="width: 100%;height: 98%;padding-left: 200px;background-color: #222835"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import '@amap/amap-jsapi-types'
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref, onMounted, shallowRef, reactive, watch } from 'vue'
import chinaJson from '@/assets/data/china.json'
import * as echarts from 'echarts'
import axios from "axios";
import { useRouter } from 'vue-router'


const router = useRouter()

const chartData = reactive({
	year: [],
	result: {},
})



var option = ref()
onMounted(() => {
	const getData = async () => {
		let res = await axios.get('/api/urbanrail/yearlist')
		if (res.status == 200) {
			let data = res.data
			// console.log("data", data)

			data.forEach(item => {
				item.region = item.region.replace(/\s/g, '');
				// console.log("item", item)
				chartData.year.push(item.year)
				let year = item.year
				if (!chartData.result[year]) {
					chartData.result[year] = [];
				}
				if (item.region != '全国') {
					switch (item.region) {
						case '北京':
							chartData.result[year].push({
								region: '北京市',
								mileage: item.mileage,
							});
							break;
						case '北京':
							chartData.result[year].push({
								region: '北京市',
								mileage: item.mileage,
							});
							break;
						case '天津':
							chartData.result[year].push({
								region: '天津市',
								mileage: item.mileage,
							});
							break;
						case '上海':
							chartData.result[year].push({
								region: '上海市',
								mileage: item.mileage,
							});
							break;
						case '重庆':
							chartData.result[year].push({
								region: '重庆市',
								mileage: item.mileage,
							});
							break;
						case '西藏':
							chartData.result[year].push({
								region: '西藏自治区',
								mileage: item.mileage,
							});
							break;
						case '宁夏':
							chartData.result[year].push({
								region: '宁夏回族自治区',
								mileage: item.mileage,
							});
							break;
						case '新疆':
							chartData.result[year].push({
								region: '新疆维吾尔自治区',
								mileage: item.mileage,
							});
							break;
						default:
							chartData.result[year].push({
								region: item.region + '省',
								mileage: item.mileage,
							});
					}



				}

			})
			// console.log("chartData.result",chartData.result)
			let timeLine = new Set(chartData.year.sort())
			let myChart = echarts.init(document.getElementById('map'));

			//初始化Amap-api
			function initMap () {
				AMapLoader.load({//加载高德地图的 JavaScript API
					key: '1e7166f6d0b8f7f9be02f4f0f0944a26', // 申请好的Web端开发者Key，首次调用 load 时必填
					version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
					plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
					AMapUI: {
						version: '1.1',
						plugins: ['overlay/SimpleMarker']
					}// 需要使用的的插件列表，如比例尺'AMap.Scale'等
				}).then((MyAMap) => {
					init(100000)//其中100000表示的是全国范围

				}).catch(e => {
					console.log(e);
				})
			}
			var currentIndex = 0

			var timeTitle = Array.from(timeLine);
			initMap()

			function init (adcode) {
				console.log("cityCode", dataCityCode.value)
				getGeoJson(adcode).then(data => {//其中的data表示的是各个省份的信息
					geoJson.value = data
					getMapData(currentIndex, dataCityCode.value?.cityCode)
				})
			}

			let geoJson = ref({})





			// console.log("timeTitle", timeTitle)

			//这里我封装了下，直接可以拿过来用
			function getGeoJson (adcode, childAdcode = '') {
				return new Promise((resolve, reject) => {
					function insideFun (adcode, childAdcode) {
						AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
							var districtExplorer = new DistrictExplorer();
							districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
								if (error) {
									console.error(error);
									reject(error);
									return;
								}
								let Json = areaNode.getSubFeatures();
								if (Json.length === 0) {
									let parent = areaNode._data.geoData.parent.properties.acroutes;
									insideFun(parent[parent.length - 1], adcode);
									return;
								}

								if (childAdcode) {
									Json = Json.filter(item => {
										return item.properties.adcode == childAdcode;
									});
								}
								let mapJson = {
									features: Json
								};
								resolve(mapJson);
							});
						});
					}
					insideFun(adcode, childAdcode);
				});
			}

			//获取数据
			function getMapData (timeIndex, cityCode = 100000) {

				if (cityCode == 100000) {
					let currentData = ref()
					currentData.value = chartData.result[timeTitle[timeIndex]]
					// console.log("currentData", currentData.value)

					// console.log("timeTitle",timeTitle)
					// console.log("chartData.result",chartData.result)
					let mapData = [],
						pointData = [],
						sum = 0

					geoJson.value.features.forEach(item => {
						currentData.value.forEach(currentItem => {
							if (currentItem.region == item.properties.name) {
								// console.log("currentItem", currentItem)
								mapData.push({
									name: item.properties.name,
									value: currentItem.mileage,
									cityCode: item.properties.adcode
								})
								pointData.push({
									name: item.properties.name,
									value: [item.properties.center[0], item.properties.center[1], currentItem.mileage],//分别拿到经纬度坐标和值
									cityCode: item.properties.adcode
								})
								sum += currentItem.mileage
							}
						})
					})
					mapData = mapData.sort(function (a, b) {
						return b.value - a.value
					});
					initEchartMap(mapData, sum, pointData)

				} else {
					let mapData = [],
						pointData = [],
						sum = 0
					geoJson.value.features.forEach(item => {
						let value = Math.random() * 3000
						mapData.push({
							name: item.properties.name,
							value: value,
							cityCode: item.properties.adcode
						})
						pointData.push({
							name: item.properties.name,
							value: [item.properties.center[0], item.properties.center[1], value],
							cityCode: item.properties.adcode
						})
						sum += value
					})
					mapData = mapData.sort(function (a, b) {
						return b.value - a.value
					});
					sum = sum / 100
					initEchartMap(mapData, sum, pointData)

				}

				// console.log("mapData", mapData)
				// console.log("pointData", pointData)
			}


			//渲染echarts
			function initEchartMap (mapData, sum, pointData) {
				// console.log("mapData", mapData)
				var xData = [],
					yData = []
				var min = mapData[mapData.length - 1].value
				var max = mapData[0].value
				if (mapData.length === 1) {
					min = 0
				}
				mapData.forEach(c => {
					xData.unshift(c.name)
					yData.unshift(c.value)
				})
				//这里做个切换，全国的时候才显示南海诸岛  只有当注册的名字为china的时候才会显示南海诸岛
				echarts.registerMap(parentInfo.value.length === 1 ? 'china' : 'map', geoJson.value);
				option.value = {
					timeline: {
						data: timeTitle,
						axisType: 'category',
						autoPlay: true,
						playInterval: 5000,
						left: '10%',
						right: '10%',
						bottom: '2%',
						width: '80%',
						label: {
							normal: {
								textStyle: {
									color: 'rgb(179, 239, 255)'
								}
							},
							emphasis: {
								textStyle: {
									color: '#fff'
								}
							}
						},
						currentIndex: currentIndex,
						symbolSize: 10,
						lineStyle: {
							color: '#8df4f4'
						},
						checkpointStyle: {
							borderColor: '#8df4f4',
							color: '#53D9FF',
							borderWidth: 2,
						},
						controlStyle: {
							showNextBtn: true,
							showPrevBtn: true,
							normal: {
								color: '#53D9FF',
								borderColor: '#53D9FF'
							},
							emphasis: {
								color: 'rgb(58,115,192)',
								borderColor: 'rgb(58,115,192)'
							}
						},

					},
					baseOption: {
						backgroundColor: '#222835',
						title: [{
							left: 'center',
							top: 10,
							// text: parentInfo[parentInfo.length - 1].cityName + '运营里程数',
							textStyle: {
								color: 'rgb(179, 239, 255)',
								fontSize: 16
							},
						},
						{
							text: parentInfo.value[parentInfo.value.length-1].cityName + sum.toFixed(2) + '（公里）',
							left: 'center',
							top: '6.5%',
							textStyle: {
								color: '#FFAC50',
								fontSize: 26
							}
						}
						],
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							},
						},
						grid: {
							right: '2%',
							top: '12%',
							bottom: '8%',
							width: '20%'
						},
						toolbox: {
							feature: {
								restore: {
									show: false
								},
								dataView: {
									show: false
								},
								saveAsImage: {
									name: parentInfo.value[parentInfo.value.length - 1].cityName + '销售额统计图'
								},
								dataZoom: {
									show: false
								},
								magicType: {
									show: false
								}
							},
							iconStyle: {
								normal: {
									borderColor: '#1990DA'
								}
							},
							top: 15,
							right: 35
						},
						geo: {
							map: parentInfo.value.length === 1 ? 'china' : 'map',
							zoom: 1.1,
							roam: true,
							left: '10%',
							top: '15%',
							tooltip: {
								trigger: 'item',
								formatter: (p) => {
									let val = p.value[2];
									if (window.isNaN(val)) {
										val = 0;
									}
									let txtCon =
										"<div style='text-align:left'>" + p.name + ":<br />运营里程：" + val.toFixed(2) + '公里</div>';
									return txtCon;
								}
							},
							label: {
								normal: {
									show: true,
									color: "rgb(249, 249, 249)", //省份标签字体颜色
									formatter: p => {
										switch (p.name) {
											case '内蒙古自治区':
												p.name = "内蒙古"
												break;
											case '西藏自治区':
												p.name = "西藏"
												break;
											case '新疆维吾尔自治区':
												p.name = "新疆"
												break;
											case '宁夏回族自治区':
												p.name = "宁夏"
												break;
											case '广西壮族自治区':
												p.name = "广西"
												break;
											case '香港特别行政区':
												p.name = "香港"
												break;
											case '澳门特别行政区':
												p.name = "澳门"
												break;

										}
										return p.name;
									}
								},
								emphasis: {
									show: true,
									color: '#f75a00',
								}
							},
							itemStyle: {
								normal: {
									areaColor: '#24CFF4',
									borderColor: '#53D9FF',
									borderWidth: 1.3,
									shadowBlur: 15,
									shadowColor: 'rgb(58,115,192)',
									shadowOffsetX: 7,
									shadowOffsetY: 6,
								},
								emphasis: {
									areaColor: '#8dd7fc',
									borderWidth: 1.6,
									shadowBlur: 25,
								}

							},
						},
						visualMap: {
							min: min,
							max: max,
							left: '3%',
							bottom: '5%',
							calculable: true,
							seriesIndex: [0],
							inRange: {
								color: ['#24CFF4', '#2E98CA', '#1E62AC']
							},
							textStyle: {
								color: '#24CFF4'
							}
						},
						xAxis: {
							type: 'value',
							scale: true,
							position: 'top',
							boundaryGap: false,
							splitLine: {
								show: false
							},
							axisLine: {
								show: true,
								lineStyle: {
									color: '#455B77'
								}
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								margin: 2,
								textStyle: {
									color: '#c0e6f9'
								}
							},
						},
						yAxis: {
							type: 'category',
							nameGap: 16,
							axisLine: {
								show: true,
								lineStyle: {
									color: '#455B77'
								}
							},
							axisTick: {
								show: false,
							},
							axisLabel: {
								interval: 0,
								textStyle: {
									color: '#c0e6f9'
								}
							},
							data: xData
						},
						series: [{
							name: timeTitle[currentIndex] + '年运营数据',
							type: 'map',
							geoIndex: 0,
							map: parentInfo.value.length === 1 ? 'china' : 'map',
							roam: true,
							zoom: 1.3,
							tooltip: {
								trigger: "item",
								formatter: p => {
									let val = p.value;
									if (p.name == '南海诸岛') return
									if (window.isNaN(val)) {
										val = 0;
									}
									let txtCon =
										"<div style='text-align:left'>" + p.name + ":<br />运营里程：" + val.toFixed(2) + '公里</div>';
									return txtCon;
								}
							},
							label: {
								normal: {
									show: false,
								},
								emphasis: {
									show: false,
								}
							},
							data: mapData,

						},
						{
							name: '散点',
							type: 'effectScatter',
							coordinateSystem: 'geo',
							rippleEffect: {
								brushType: 'fill'
							},
							itemStyle: {
								normal: {
									color: '#F4E925',
									shadowBlur: 10,
									shadowColor: '#333'
								}
							},
							data: pointData,

							symbolSize: function (val) {
								let value = val[2]
								if (value == max) {
									return 27
								}
								return 10
							},
							showEffectOn: 'render', //加载完毕显示特效
						},
						{
							type: 'bar',
							barGap: '-100%',
							barCategoryGap: '60%',
							itemStyle: {
								normal: {
									color: '#11AAFE'
								},
								emphasis: {
									show: false
								}
							},
							data: yData
						}

						]

					},


				}


				myChart.setOption(option.value, true)


				// //点击前解绑，防止点击事件触发多次
				myChart.off('click');
				myChart.on('click', echartsMapClick);

				// //监听时间切换事件
				myChart.off('timelinechanged');
				myChart.on('timelinechanged', params => {
					// console.log("params",params)
					currentIndex = params.currentIndex;
					getMapData(currentIndex, 100000);
				});
			}
			const chartPanel = document.getElementById('map');
			const backButton = document.createElement('div');
			backButton.className = 'back';
			backButton.innerHTML = '返 回';
			backButton.style.position = 'absolute';
			backButton.style.left = '25px';
			backButton.style.top = '25px';
			backButton.style.color = 'rgb(179, 239, 255)';
			backButton.style.fontSize = '20px';
			backButton.style.cursor = 'pointer';
			backButton.style.zIndex = '100';

			const previewButton = document.createElement('div');
			previewButton.className = 'back';
			previewButton.innerHTML = '预测分析';
			previewButton.style.position = 'absolute';
			previewButton.style.left = '25px';
			previewButton.style.top = '65px';
			previewButton.style.color = 'rgb(179, 239, 255)';
			previewButton.style.fontSize = '20px';
			previewButton.style.cursor = 'pointer';
			previewButton.style.zIndex = '100';

			chartPanel.appendChild(backButton);
			chartPanel.appendChild(previewButton);


			//当点击返回按钮的时候
			backButton.addEventListener('click', () => {
				if (parentInfo.value.length === 1) {
					return;
				}
				parentInfo.value.pop();
				init(parentInfo.value[parentInfo.value.length - 1].code);
			});
			//当点击预测分析按钮的时候
			previewButton.addEventListener('click', () => {
				router.push({
					path: '/forecastDetails',
					query: {
						cityName: parentInfo.value[parentInfo.value.length - 1].cityName
					}
				})
				myChart.dispose();
			});
			// let currentProvince = ref('全国')
			function echartsMapClick (params) {
				// currentProvince.value=params.data.name
				console.log("params", params)
				console.log("parentInfo", parentInfo.value)
				// console.log("currentProvince",currentProvince.value)
				if (!params.data) {
					return
				} else {
					//如果当前是最后一级，那就直接return
					if (parentInfo.value[parentInfo.value.length - 1].code == params.data.cityCode) {
						return
					}
					dataCityCode.value = params.data
					parentInfo.value.push({
						cityName: dataCityCode.value.name,
						code: dataCityCode.value.cityCode
					})
					console.log("parentInfo", parentInfo.value)

					init(dataCityCode.value.cityCode)
				}
			}

			// 注册中国地图数据
			echarts.registerMap('china', chinaJson)
		}
	}
	getData()


})
let dataCityCode = ref()
let parentInfo = ref([{
	cityName: '全国',
	code: 100000
}])
// //echarts点击事件

</script>

<style lang='scss' scoped>
.es-block {
	width: 100%;
	height: 100%;
	padding: 16px;
	// background-color: var(--es-block-bg);
}
</style>
