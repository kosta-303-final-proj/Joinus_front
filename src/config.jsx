import axios from "axios";
export const baseUrl = "http://localhost:8080";
export const reactUrl = "http://localhost:5173";

// sessionStorage에서 access token을 가져와서 Bearer 형식으로 반환하는 헬퍼 함수
const getAuthHeader = () => {
    const accessToken = sessionStorage.getItem('access_token');
    
    if (accessToken) {
        // Bearer 접두사가 없으면 추가
        if (accessToken.startsWith('Bearer ')) {
            return accessToken;
        }
        return `Bearer ${accessToken}`;
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
    
    // 표준 방식: Authorization 헤더에 Bearer <access_token>만 추가
    if (authToken) {
        headers['Authorization'] = authToken;
    }
    
    // Refresh Token은 별도 헤더로 (필요한 경우)
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (refreshToken) {
        if (refreshToken.startsWith('Bearer ')) {
            headers['X-Refresh-Token'] = refreshToken;
        } else {
            headers['X-Refresh-Token'] = `Bearer ${refreshToken}`;
        }
    }
    
    // 서버에 비동기로 요청 보내고 응답을 기다릴 때 await fetch를 사용
    // 즉, 서버에서 데이터 받을 때까지 멈췄다가 응답을 처리합니다.
    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers,
    });
    
    // 401, 403 에러 시 로그인 페이지로 리다이렉트
    if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('userInfo');
        window.location.href = `${reactUrl}/login`;
        throw new Error('인증이 필요합니다.');
    }
    
    return response;
};

// sessionStorage 토큰을 가져와서 Authorization 헤더에 자동으로 추가하는 axios 인스턴스
export const myAxios = () => {
    let instance = axios.create({
        baseURL : baseUrl,
        timeout:30000,
    })

    // Request Interceptor: 모든 요청 전에 토큰을 헤더에 추가
    instance.interceptors.request.use(
        (config) => {
            // sessionStorage에서 access token 가져오기
            const accessToken = sessionStorage.getItem('access_token');
            const refreshToken = sessionStorage.getItem('refresh_token');
            
            // 표준 방식: Authorization 헤더에는 Bearer <access_token>만
            if (accessToken) {
                if (accessToken.startsWith('Bearer ')) {
                    config.headers.Authorization = accessToken;
                } else {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
            }
            
            // Refresh Token은 별도 헤더로 (필요한 경우)
            if (refreshToken) {
                if (refreshToken.startsWith('Bearer ')) {
                    config.headers['X-Refresh-Token'] = refreshToken;
                } else {
                    config.headers['X-Refresh-Token'] = `Bearer ${refreshToken}`;
                }
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
            // 응답 헤더에 새로운 토큰이 있으면 갱신 (표준 Bearer 형식)
            const authHeader = response.headers.authorization || response.headers.Authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const accessToken = authHeader.replace('Bearer ', '');
                sessionStorage.setItem('access_token', accessToken);
            }
            
            // Refresh Token은 별도 헤더에서
            const refreshHeader = response.headers['x-refresh-token'] || response.headers['X-Refresh-Token'];
            if (refreshHeader && refreshHeader.startsWith('Bearer ')) {
                const refreshToken = refreshHeader.replace('Bearer ', '');
                sessionStorage.setItem('refresh_token', refreshToken);
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
                        sessionStorage.removeItem('access_token');
                        sessionStorage.removeItem('refresh_token');
                        sessionStorage.removeItem('userInfo');
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