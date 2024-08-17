<template>
	<section class="parallax">
		<!-- 固定背景 -->
		<img src="/public/hill1.png" id="hill1" style="bottom: -300px;left: 0px;right:0px;width: 100vw;">
		<img src="/public/bg.png" id="hill2" style="bottom: -50px;left: 0px;width: 900px;">
		<!-- 左侧 -->
		<img src="/public/carBus.png" id="hill4" ref="carBus" style="bottom: -50px;left: -200px;width: 800px;z-index:999">
		<img src="/public/topHover.png" id="hill3" ref="topHover" style="top: -400px;left: -200px;width: 800px;">
		<!-- 右侧 -->
		<img src="/public/carRight.png" id="hill5" ref="carRight"
			style="right:-300px;bottom: -100px;width:1100px;z-index:999">
		<img src="/public/tree.png" id="hill6" ref="tree" style="right:0px;top: 0px;width:800px">
		<h2 id="text" ref="text">{{ cityName }}轨道交通预测</h2>
	</section>
	<div style="width:100vw;min-height:1300px;background-color:#68ccc4;">
		<section class="sec">
			<h2>{{ cityName }}政府规划</h2>
			<p>{{ cityContent }}</p>
		</section>
		<div style="display: flex;justify-content: space-evenly;flex-direction: row;">
			<div class="card" style="margin-left: -500px;" @click="pushPeopleNumber">
				<div class="content">
					<div class="back">
						<div class="back-content">
							<svg stroke="#ffffff" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 50 50" height="60px" width="60px" fill="#ffffff">
								<g stroke-width="0" id="SVGRepo_bgCarrier"></g>
								<g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
								<image :href="`/src/assets/svg/实有人口.png`" width="50" height="60" />
							</svg>
							<strong>人口预测</strong>
						</div>
					</div>
					<div class="front">
						<div class="img">
							<div class="circle">
							</div>
							<div class="circle" id="right">
							</div>
							<div class="circle" id="bottom">
							</div>
						</div>

						<div class="front-content">
							<small class="badge">进入</small>

						</div>
					</div>
				</div>
			</div>
			<div class="card" style="margin-right: -500px;" @click="pushEconomic">
				<div class="content">
					<div class="back">
						<div class="back-content">
							<svg stroke="#ffffff" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 50 50" height="60px" width="60px" fill="#ffffff">
								<g stroke-width="0" id="SVGRepo_bgCarrier"></g>
								<g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>

								<image :href="`/src/assets/svg/经济.png`" width="50" height="60" />

							</svg>
							<strong>经济发展水平预测</strong>
						</div>
					</div>
					<div class="front">

						<div class="img">
							<div class="circle">
							</div>
							<div class="circle" id="right">
							</div>
							<div class="circle" id="bottom">
							</div>
						</div>

						<div class="front-content">
							<small class="badge">进入</small>

						</div>
					</div>
				</div>
			</div>
		</div>
		<div style="display: flex;justify-content: space-evenly;flex-direction: row;">
			<div class="card" style="margin-left: -500px;margin-top: 400px;" @click="pushTraffic">
				<div class="content">
					<div class="back">
						<div class="back-content">
							<svg stroke="#ffffff" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 50 50" height="60px" width="60px" fill="#ffffff">
								<g stroke-width="0" id="SVGRepo_bgCarrier"></g>
								<g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>

								<image :href="`/src/assets/svg/高铁.png`" width="50" height="60" />

							</svg>
							<strong>城轨预测</strong>
						</div>
					</div>
					<div class="front">

						<div class="img">
							<div class="circle">
							</div>
							<div class="circle" id="right">
							</div>
							<div class="circle" id="bottom">
							</div>
						</div>

						<div class="front-content">
							<small class="badge">进入</small>

						</div>
					</div>
				</div>
			</div>
			<div class="main" style="margin-right: -310px;margin-top: 400px;">
				<div class="card" id="c1">
					<div class="back">
						<div class="back-content">
							<strong style="padding: 12px;"><a :href="urlContent[0]" target="_blank">{{ urlContentName[0]
							}}</a></strong>
						</div>
					</div>
				</div>
				<div class="card" id="c2">
					<div class="back">
						<div class="back-content">
							<strong style="padding: 12px;"><a :href="urlContent[1]" target="_blank">{{ urlContentName[1] }}</a></strong>
						</div>
					</div>
				</div>
				<div class="card" id="c3">
					<div class="back">
						<div class="back-content">
							<strong style="padding: 12px;"><a :href="urlContent[2]" target="_blank">{{ urlContentName[2] }}</a></strong>
						</div>
					</div>
				</div>
				<div class="card" id="c4">
					<div class="back">
						<div class="back-content">
							<svg stroke="#ffffff" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 50 50" height="60px" width="60px" fill="#ffffff">
								<g stroke-width="0" id="SVGRepo_bgCarrier"></g>
								<g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>

								<image :href="`/src/assets/svg/法律法规.png`" width="50" height="60" />

							</svg>
							<strong>政策法规</strong>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Chart></Chart>
</template>

<script setup lang='ts'>
import { onMounted, ref ,watch} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import Chart from '../screen/components/chat/chat.vue'
import axios from "axios"
import { useScreenStore } from '@/store'



const store = useScreenStore()

console.log("store",store)
const router = useRouter()
const route = useRoute()
let cityName = ref(route.query.cityName)
let cityContent = ref()
let urlContent = ref([])
let urlContentName = ref([])
const getData = async () => {
	try {
		let res = await axios.get('/api/urbanrail/getcitycontent')
		console.log("res", res)
		if (res.status == 200) {
			let data = res.data
			data.forEach(item => {
				if (item.cityName == cityName.value) {
					cityContent.value = item.content
					urlContent.value = item.regulatory.split(",");
					urlContentName.value = item.regulatoryName.split(",");
				}
			})
			console.log("cityContent", cityContent.value)
			console.log("urlContent", urlContent.value)
		}
	} catch (err) {
		console.log(err)
	}
}
getData()

const pushPeopleNumber = () => {
	store.changeStateMethod(0)
	router.push({
		path: '/peopleNumberDetail',
		query: {
			cityName: cityName.value,
			state:0
		}
	})
	console.log("stateMethod",store.stateMethod)

}
watch(store.stateMethod,(newV,oldV)=>{
	console.log("newV",newV)
})
const pushEconomic = () => {
	store.changeStateMethod(1)

	router.push({
		path: '/economic',
		query: {
			cityName: cityName.value,
			state:1
		}
	})
	console.log("stateMethod",store.stateMethod)
}

const pushTraffic = () => {
	store.changeStateMethod(2)
	router.push({
		path: '/traffic',
		query: {
			cityName: cityName.value,
			state:2
		}
	})
	console.log("stateMethod",store.stateMethod)

}

console.log("route",)
let text = ref()
let carBus = ref()
let topHover = ref()
let carRight = ref()
let tree = ref()
let scrollValue = ref()

onMounted(() => {
	window.addEventListener('scroll', () => {
		scrollValue.value = window.scrollY;
		text.value.style.marginTop = scrollValue.value * 1.5 + 'px';
		carBus.value.style.left = (scrollValue.value * -1.5 - 200) + 'px';
		topHover.value.style.left = (scrollValue.value * -1.5 - 200) + 'px';
		carRight.value.style.right = (scrollValue.value * -1.5 - 300) + 'px';
		tree.value.style.right = scrollValue.value * -0.5 + 'px';
	}, true);
})

</script>
<style lang='scss' scoped>
.parallax {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
	overflow-x: hidden;
	overflow-y: hidden
}

#text {
	position: absolute;
	font-size: 5em;
	color: #3adf00;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, .2);
	z-index: 99999
}

.parallax img {
	position: absolute;
	// top: 0;
	// left: 0;
	width: 100%;
	pointer-events: none;
}

.sec {
	position: relative;
	background: #68ccc4;
	padding: 100px;
}

.sec h2 {
	font-size: 3em;
	color: #fff;
	margin-bottom: 10px;
}

.sec p {
	font-size: 1em;
	color: #fff;
	font-weight: 300;
}

.card {
	overflow: visible;
	width: 190px;
	height: 254px;
}

.content {
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
	transition: transform 800ms;
	box-shadow: 0px 0px 10px 1px #000000ee;
	border-radius: 5px;
}

.front,
.back {
	background-color: #151515;
	position: absolute;
	width: 100%;
	height: 100%;
	backface-visibility: hidden;
	-webkit-backface-visibility: hidden;
	border-radius: 5px;
	overflow: hidden;
}

.back {
	width: 100%;
	height: 100%;
	justify-content: center;
	display: flex;
	align-items: center;
	overflow: hidden;
}

.back::before {
	position: absolute;
	content: ' ';
	display: block;
	width: 160px;
	height: 160%;
	background: linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, #ff9966, transparent);
	animation: rotation_481 5000ms infinite linear;
}

.back-content {
	position: absolute;
	width: 99%;
	height: 99%;
	background-color: #151515;
	border-radius: 5px;
	color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 30px;
}

.card:hover .content {
	transform: rotateY(180deg);
}

@keyframes rotation_481 {
	0% {
		transform: rotateZ(0deg);
	}

	0% {
		transform: rotateZ(360deg);
	}
}

.front {
	transform: rotateY(180deg);
	color: white;
	cursor: pointer;
}

.front .front-content {
	position: absolute;
	width: 100%;
	height: 100%;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	cursor: pointer;
}

.front-content .badge {
	background-color: #00000055;
	padding: 2px 10px;
	border-radius: 10px;
	backdrop-filter: blur(2px);
	width: fit-content;
}

.description {
	box-shadow: 0px 0px 10px 5px #00000088;
	width: 100%;
	padding: 10px;
	background-color: #00000099;
	backdrop-filter: blur(5px);
	border-radius: 5px;
}

.title {
	font-size: 11px;
	max-width: 100%;
	display: flex;
	justify-content: space-between;
}

.title p {
	width: 50%;
}

.card-footer {
	color: #ffffff88;
	margin-top: 5px;
	font-size: 8px;
}

.front .img {
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
}

.circle {
	width: 90px;
	height: 90px;
	border-radius: 50%;
	background-color: #ffbb66;
	position: relative;
	filter: blur(15px);
	animation: floating 2600ms infinite linear;
}

#bottom {
	background-color: #ff8866;
	left: 50px;
	top: 0px;
	width: 150px;
	height: 150px;
	animation-delay: -800ms;
}

#right {
	background-color: #ff2233;
	left: 160px;
	top: -80px;
	width: 30px;
	height: 30px;
	animation-delay: -1800ms;
}

@keyframes floating {
	0% {
		transform: translateY(0px);
	}

	50% {
		transform: translateY(10px);
	}

	100% {
		transform: translateY(0px);
	}
}

.card {
	width: 190px;
	height: 254px;
	background: rgba(211, 211, 211, 0.199);
	position: absolute;
	transition: .3s ease-in-out;
	cursor: pointer;
	box-shadow: 0px 0px 30px -10px rgba(0, 0, 0, 0.3);
}

#c1 {
	background-color: black;
}

#c2 {
	background-color: blue;
}

#c3 {
	background-color: red;
}

#c4 {
	background-color: #ffff;
}

.main:hover #c1 {
	transform: translateX(-100px) rotate(-40deg);
}

.main:hover #c2 {
	transform: translateX(-50px) rotate(-30deg);
}

.main:hover #c3 {
	transform: translateX(0) rotate(-20deg);
}

.main:hover #c4 {
	transform: translateX(50px) rotate(-10deg);
}

#c1:hover {
	transform: translateX(-150px) rotate(0deg) !important;
}

#c2:hover {
	transform: translateX(-100px) rotate(0deg) !important;
}

#c3:hover {
	transform: translateX(-50px) rotate(0deg) !important;
}

#c4:hover {
	transform: translateX(50px) rotate(0deg) !important;
}

.main {
	// display: grid;
	// height: 50vmax;
	place-items: center;
}
</style>
