import axios from "axios";
export const baseUrl = "http://localhost:8080";
export const reactUrl = "http://localhost:5173";

export const myAxios = (token, setToken) => {
    let instance = axios.create({
        baseURL : baseUrl,
        timeout:5000,
    })

    // 필요하다면 인터셉터 추가 가능
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
        // 토큰 만료 등 처리
        return Promise.reject(error);
        }
    );
    // instance.interceptors.response.use(//응답이 올때마다 헤더에 토큰이 있는지 확인하여 토큰 갱신
    //     (response) => { // 토큰이 만료되고 다시 줄때 
    //         console.log(response)
    //         if(response.headers.authorization){
    //             setToken(response.headers.authorization)
    //         }
    //         return response;
    //     }
    //     ,
    //     (error) =>{ //error 발생 시 처리
    //         if(error.response && error.response.status){
    //             switch(error.response.status) {
    //                 case 401: //4001, 4003은 로그인 다시 시도하게 하기
    //                 case 403: 
    //                     window.location.href=`${reactUrl}/login`; break; //나중에 login으로 돌려
    //                 default:
    //                     return Promise.reject(error);
    //             }
    //         }
    //         return Promise.reject(error);
    //     }
    // )

    // // 토큰이 있으면 헤더에 토큰을 삽입하여 요청
    // token && instance.interceptors.request.use((config)=>{
    //     config.headers.Authorization = token;
    //     return config;
    // })

    return instance;
}