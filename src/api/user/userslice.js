import api from "../api";

export const getCurrentUser =
    async (payload) => {

        const response =
            await api.get(
                "/user/getCurrentUser",
                payload
            );

        return response.data;
    };