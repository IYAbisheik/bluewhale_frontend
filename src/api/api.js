import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest =
            error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry =
                true;

            try {

                const response =
                    await axios.post(
                        "http://localhost:5000/api/v1/auth/refresh-token",
                        {},
                        {
                            withCredentials: true,
                        }
                    );

                const newAccessToken =
                    response.data.accessToken;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(
                    originalRequest
                );

            } catch (refreshError) {

                console.log(
                    "Refresh token expired"
                );

                localStorage.removeItem(
                    "accessToken"
                );

                window.location.href =
                    "/";

                return Promise.reject(
                    refreshError
                );

            }

        }

        return Promise.reject(error);

    }
);

export default api;