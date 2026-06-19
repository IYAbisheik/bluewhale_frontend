import api from "../api";

export const createRoom =
    async (payload) => {

        const response =
            await api.post(
                "/rooms/create",
                payload
            );

        return response.data;
    };

export const joinRoom =
    async (payload) => {

        const response =
            await api.post(
                "/rooms/join",
                payload
            );

        return response.data;
    };

export const getRooms =
    async () => {

        const response =
            await api.get(
                "/rooms"
            );

        return response.data;
    };

export const getRoomById =
    async (roomId) => {

        const response =
            await api.get(
                `/rooms/${roomId}`
            );

        return response.data;
    };

export const getRoomMembers =
    async (roomId) => {

        const response =
            await api.get(
                `/rooms/${roomId}/members`
            );

        return response.data;
    };

export const getMessages =
    async (roomId) => {

        const response =
            await api.get(
                `/rooms/${roomId}/messages`
            );

        return response.data;
    };