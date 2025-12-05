import axios from "axios";
export const baseUrl = "http://localhost:8080";
export const reactUrl = "http://localhost:5173";

// localStorage에서 토큰을 가져와서 Authorization 헤더에 추가하는 헬퍼 함수
const getAuthHeader = () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken && refreshToken) {
        const tokenData = {
            access_token: accessToken,
            refresh_token: refreshToken
        };
        return JSON.stringify(tokenData);
    }
    return null;
};

// fetch wrapper 함수 - 토큰을 자동으로 헤더에 추가
export const apiFetch = async (url, options = {}) => {
    const authToken = getAuthHeader();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    // 토큰이 있으면 Authorization 헤더에 추가
    if (authToken) {
        headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers,
    });
    
    // 401, 403 에러 시 로그인 페이지로 리다이렉트
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userInfo');
        window.location.href = `${reactUrl}/login`;
        throw new Error('인증이 필요합니다.');
    }
    
    return response;
};

// localStorage에서 토큰을 가져와서 Authorization 헤더에 자동으로 추가하는 axios 인스턴스
export const myAxios = () => {
    let instance = axios.create({
        baseURL : baseUrl,
        timeout:5000,
    })

    // Request Interceptor: 모든 요청 전에 토큰을 헤더에 추가
    instance.interceptors.request.use(
        (config) => {
            // localStorage에서 토큰 가져오기
            const accessToken = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');
            
            // 토큰이 있으면 JSON 문자열로 만들어서 Authorization 헤더에 추가
            if (accessToken && refreshToken) {
                const tokenData = {
                    access_token: accessToken,
                    refresh_token: refreshToken
                };
                config.headers.Authorization = JSON.stringify(tokenData);
            }
            
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor: 응답 처리 및 에러 처리
    instance.interceptors.response.use(
        (response) => {
            // 응답 헤더에 새로운 토큰이 있으면 갱신
            const authHeader = response.headers.authorization || response.headers.Authorization;
            if (authHeader) {
                try {
                    const tokenData = JSON.parse(authHeader);
                    if (tokenData.access_token) {
                        localStorage.setItem('access_token', tokenData.access_token);
                    }
                    if (tokenData.refresh_token) {
                        localStorage.setItem('refresh_token', tokenData.refresh_token);
                    }
                } catch (e) {
                    console.error('토큰 갱신 실패:', e);
                }
            }
            return response;
        },
        (error) => {
            // 401, 403 에러 시 로그인 페이지로 리다이렉트
            if (error.response && error.response.status) {
                switch(error.response.status) {
                    case 401: // 인증 실패
                    case 403: // 권한 없음
                        // 토큰 삭제
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('userInfo');
                        // 로그인 페이지로 리다이렉트
                        window.location.href = `${reactUrl}/login`;
                        break;
                    default:
                        return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
}