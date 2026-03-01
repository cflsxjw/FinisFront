import axios from 'axios';
import FinisNotification from "../components/FinisNotification/FinisNotification.js";

// 创建实例
const axiosServer = axios.create({
    baseURL: '/api',
    timeout: 1000 // 考虑到你可能上传巨型图片，超时设置稍长
});

axiosServer.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosServer.interceptors.response.use(
    res => {
        return res;
    },
    error => {
        if (error.response.status >= 500) {
            FinisNotification({
                title: 'Error',
                message: '服务器内部异常',
                type: "Error"
            });
        }

        return Promise.reject(error);
    }
);

export default axiosServer;