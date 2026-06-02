import axios from 'axios';
import api from '../api';

export const registerApi = async (payload) => {

  const response = await api.post(
    '/users/signup',
    payload
  );

  return response.data;
};


export const loginApi = async (payload) => {

  const response = await api.post(
    '/users/login',
    payload
  );

  return response.data;
};