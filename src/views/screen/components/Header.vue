<template>
	<div class="es-screen-header">
	<h1 class="es-screen-logo">
		<span>轨道交通</span>
	</h1>
		<div class="es-screen-header-title">
			<a href="https://www.chinametro.net/" target="_blank">{{ store.title }}</a>
		</div>
		<div class="es-screen-header-right">
			<button @click="changeScreen()" class="button">切换</button>
			<img class="theme-change" :src="icon" @click="handleChangeTheme">
			<span class="datetime">{{ currentTime }}</span>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { computed, onBeforeUnmount, ref } from 'vue'

import dayjs from 'dayjs'
import { useScreenStore } from '@/store'
import darkIcon from '@/assets/images/screen/qiehuan_dark.png'
import lightIcon from '@/assets/images/screen/qiehuan_light.png'
import githubIconDark from '@/assets/images/screen/github_dark.svg'
import githubIconLight from '@/assets/images/screen/github_light.svg'
const store = useScreenStore()

const icon = computed(() => store.theme === 'dark' ? darkIcon : lightIcon)
const githubIcon = computed(() => store.theme === 'dark' ? githubIconDark : githubIconLight)

//当切换图表当中触发的事件
const changeScreen=()=>{
	store.stateScreen=!store.stateScreen
	// console.log("store.stateScreen",store.stateScreen)
}
const currentTime = ref('')
const timeId = ref()
function handleChangeTheme() {
	store.$patch({
		theme: store.theme === 'dark' ? 'light' : 'dark'
	})
}

function startTime() {
	timeId.value = setTimeout(() => {
		currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
		startTime()
	}, 1000)
}

onBeforeUnmount(() => {
	clearTimeout(timeId.value)
})

startTime()
</script>

<style lang='scss' scoped>
.button {
 --color: #00A97F;
 padding: 0.8em 1.7em;
 background-color: transparent;
 border-radius: .3em;
 position: relative;
 overflow: hidden;
 cursor: pointer;
 transition: .5s;
 font-weight: 400;
 font-size: 17px;
 font-family: inherit;
 text-transform: uppercase;
 color: var(--color);
 z-index: 1;
}

.button::before, .button::after {
 content: '';
 display: block;
 width: 50px;
 height: 50px;
 transform: translate(-50%, -50%);
 position: absolute;
 border-radius: 50%;
 z-index: -1;
 background-color: var(--color);
 transition: 1s ease;
}

.button::before {
 top: -1em;
 left: -1em;
}

.button::after {
 left: calc(100% + 1em);
 top: calc(100% + 1em);
}

.button:hover::before, .button:hover::after {
 height: 410px;
 width: 410px;
}

.button:hover {
 color: rgb(10, 25, 30);
}

.button:active {
 filter: brightness(.8);
}

.es-screen-header {
	position: relative;
	width: 100%;
	height: var(--es-header-height);
	background-image: url('@/assets/images/screen/header_border_dark.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	animation: fade 3s;
	&-title {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 487px;
		height: var(--es-header-height);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30px;
		font-weight: 500;
		letter-spacing: 7px;
		text-shadow: 0px 2px 20px rgba(222,171,155,0.6);
	}
	.es-screen-logo {
		display: flex;
    align-items: center;
		height: calc(var(--es-header-height) - 20px);
	}
	&-right {
		display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
		img {
			width: 30px;
			margin-right: 16px;
			cursor: pointer;
			transition: .3s cubic-bezier(.175,.885,.32,1.275);
			&:hover {
				transform: scale(1.2);
			}
		}
	}
}

@keyframes fade {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
