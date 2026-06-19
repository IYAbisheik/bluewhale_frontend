import api from '../api';
import { token } from "../../utils/utils";

export const registerApi = async (payload) => {

  const response = await api.post(
    '/auth/register',
    payload
  );

  return response.data;
};


export const loginApi = async (payload) => {

  const response = await api.post(
    '/auth/login',
    payload
  );

  return response.data;
};

export const verifyEmailApi = async (param) => {

  const response = await api.post(
    `/auth/verify-email/${param}`
  )

  return response;
}

export const logout = async () => {
  const response = await api.post(
    '/auth/logout',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}