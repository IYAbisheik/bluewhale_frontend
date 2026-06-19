import { token } from "../../utils/utils";
import api from "../api";

export const generate2FAApi = () => {
  return api.post(
    "/auth/generate-2fa",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verify2FAApi = (
  payload
) => {
  return api.post(
    "/auth/verify-2fa",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifyLoginOtpApi = (
  payload
) => {
  return api.post(
    "/auth/verify-login-otp",
    payload
  )
}

export const disable2FAApi = () => {
  return api.post(
    "/auth/disable-2fa",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};