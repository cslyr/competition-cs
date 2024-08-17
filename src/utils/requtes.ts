import axios from "axios";

const http = axios.create({
	baseURL: "http://localhost:8082",
	timeout: 10000,
});

//添加请求拦截器
http.interceptors.request.use(
	function (config) {
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

//添加响应拦截器
http.interceptors.response.use(
	function (response) {
		console.log(response,'response')
		return response;
	},
	function (error) {0
		return Promise.reject(error);
	}
);

export default http
