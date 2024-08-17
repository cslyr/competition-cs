<template>
	<div class="icon" @click="showModal">
		<div>
			<div class="circle" style="--s:1"></div>
			<div class="circle" style="--s:2"></div>
			<div class="circle" style="--s:3"></div>
			<img src="/public/Frame.png">
		</div>

		<div class="chatModal" :key="1" :class="isShowModal ? 'showModalClass' : 'showModalFalse'">
			<!-- 头部区域 -->
			<div class="chatHeader">
				<div class="left">
					<img class="leftTopIcon" src="/public/Frame48.png">
					<span style="margin-right: 10px;font-size: 24px;color: #5470c6;">GPT</span>
				</div>
				<div class="right">
					<span class="closeIcon" style="font-size: 24px;color: #5470c6;" @click.stop="cancel">x</span>
				</div>
			</div>
			<!-- 内容区域 -->
			<div style="height: calc(100% - 110px);overflow-y: scroll;" ref="chatContent">
				<div class="chatContent" v-for="item in getContent">
					<div class="userChatItem" v-if="item.ask != ''">
						<div class="header">
							<span class="nickName">我</span>
							<img class="avatar" src="/public/user.png">
						</div>
						<div class="content">{{ item.ask }}</div>
					</div>
					<div class="AiChatItem" v-else>
						<div class="header">
							<img class="avatar" src="/public/Frame.png">
							<span class="nickName">GPT</span>
						</div>
						<div class="content">{{ item.answer }}</div>
					</div>
				</div>
			</div>

			<!-- 底部区域 -->
			<div class="chatFooter">
				<el-input placeholder="请输入要提问的内容" type="textarea" v-model="inputContent"
					:style="{ 'width': storeMethod == 3 ? '90%' : '80%' }" @keyup.enter="send" />
				<el-button type="primary" class="sendBtn" @click="send" size="default">
					<el-icon :size="30">
						<Promotion />
					</el-icon>
				</el-button>
				<el-button type="primary" class="sendBtn" @click="sendPreview" size="default" v-if="storeMethod != 3">
					<el-icon :size="30">
						<View />
					</el-icon>
				</el-button>
			</div>
		</div>
	</div>
</template>
<script setup lang='ts'>

import { ref, nextTick, watch } from 'vue'
import axios from "axios";
import { useScreenStore } from '@/store'
const store = useScreenStore()

let storeMethod = ref(store.stateMethod)
console.log("store.stateMethod", store.stateMethod)

let isShowModal = ref(false)
let inputContent = ref<string>()
let chatContent = ref()
//点击显示gpt提示框
const showModal = () => {
	isShowModal.value = true

}

//关闭GPT
const cancel = () => {
	isShowModal.value = false
}

let getContent = ref<{ ask: string, answer: string }[]>([])
//发送内容
const send = async () => {
	if (inputContent.value) {
		getContent.value.push({ ask: inputContent.value!, answer: '' })
		nextTick(() => { chatContent.value.scrollTop = chatContent.value.scrollHeight })
		let res = await axios.post('api/spark/chat', {
			chatContent: JSON.stringify([{ role: 'user', content: inputContent.value }])
		});
		if (res.status == 200) {
			// console.log("ask", askContent.value)
			inputContent.value = ''
			getContent.value.push({ ask: '', answer: res.data.answer })
			nextTick(() => { chatContent.value.scrollTop = chatContent.value.scrollHeight })
		}
		console.log("reaGPT", res);
	}

}
const sendPreview=async()=>{
	console.log("store.content",store.content)
	let res = await axios.post('api/spark/chat', {
			chatContent: JSON.stringify([{ role: 'user', content: store.content }])
		});
		if (res.status == 200) {
			getContent.value.push({ ask: '', answer: res.data.answer })
			nextTick(() => { chatContent.value.scrollTop = chatContent.value.scrollHeight })
		}
}
</script>
<style  lang='scss' scoped>
.showModalClass {
	display: block;
}

.showModalFalse {
	display: none;
}

.icon {
	position: fixed;
	z-index: 9999;
	right: 38px;
	bottom: 40px;
	border-radius: 50%;

	img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		cursor: pointer;
	}
}

.circle {
	cursor: pointer;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 2px solid skyblue;
	position: absolute;
	animation: expand 2s linear infinite;
	animation-delay: calc(var(--s) * 1.33s);
}

@keyframes expand {
	0% {
		transform: scale(0);
		opacity: 1;
	}

	100% {
		transform: scale(1.5);
		opacity: 0;
	}
}

.chatModal {
	padding: 0 10px;
	position: fixed;
	z-index: 999;
	right: 90px;
	bottom: 100px;
	width: 25%;
	height: 75%;
	min-width: 400px;
	min-height: 300px;
	border-radius: 5px;
	background: white;
	box-shadow: 0 0 2px rgb(243, 240, 240);
}

.chatHeader {
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.left {
		height: 40px;
		display: flex;
		align-items: center;

		.leftTopIcon {
			width: 40px;
			height: 40px;
			margin-right: 10px;
		}
	}

	.right {
		height: 40px;
		display: flex;
		align-items: center;

		.closeIcon {
			z-index: 9999;
			margin-left: 20px;
			font-size: 20px;
			margin-top: -5px;
			cursor: pointer;
		}
	}
}

.chatContent {
	width: 100%;

	overflow: auto;
	overflow-x: hidden;
	padding: 8px;
	// background-color: aqua;
}

.userChatItem {
	width: 100%;
	min-height: 80px;
	margin-bottom: 10px;

	.header {
		width: 100%;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.avatar {
			margin-left: 10px;
			width: 48px;
			border-radius: 50%;
		}

		.nickName {
			color: #131212;
			font-size: 18px;
			line-height: 30px;
		}
	}
}

.content {
	white-space: pre-wrap;
	word-break: break-all;
	max-width: 90%;
	padding: 12px;
	font-size: 16px;
	border-radius: 8px;
	margin-top: 8px;
	margin-left: 20px;
	background: rgb(242, 240, 246);
	color: #131212;
}

.AiChatItem {
	min-height: 80px;
	width: 100%;
	margin-top: 15px;

	.header {
		width: 100%;
		height: 30px;
		display: flex;
		align-items: center;

		.avatar {
			width: 48px;
			// border-radius: 50%;
		}

		.nickName {
			color: #131212;
			font-size: 18px;
			margin-left: 10px;
			line-height: 30px;
		}
	}
}

:deep(.el-textarea__inner) {
	height: 50px !important;
}

.chatFooter {
	width: 100%;
	margin-top: 10px;
	height: 50px;
	// border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	transition: all .3s;
	display: flex;
	align-items: end;

	.sendBtn {
		margin-left: 3px;
		height: 50px !important;
		width: 10%;
		height: 28px;
		border-radius: 5px;
		background: #6690FF;
		border: transparent;
	}

}
</style>
