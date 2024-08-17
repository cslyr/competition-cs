import http from '../utils/requtes'

export const getMonthlistData=()=>{
	return http.get('/urbanrail/monthlist')
}
