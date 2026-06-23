import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmailApi } from "../api/auth/authApi";

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState(
        "Verifying your email..."
    );

    useEffect(() => {
        verifyEmail();
    }, [verifyEmail]);

    const verifyEmail = useCallback(async() => {
        try {
            const response = await verifyEmailApi(token)

            setStatus("success");
            setMessage(
                response?.data?.message ||
                "Email verified successfully."
            );

            // setTimeout(() => {
            //     navigate("/");
            // }, 3000);

        } catch (error) {
            setStatus("error");

            setMessage(
                error?.response?.data?.message ||
                "Invalid or expired verification link."
            );
        }
    }, [token])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-200 text-center">

                {status === "loading" && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Verifying Email...
                        </h2>

                        <p className="text-gray-600">
                            {message}
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mb-6 text-6xl">
                            ✅
                        </div>

                        <h2 className="text-2xl font-bold text-green-600 mb-3">
                            Email Verified
                        </h2>

                        <p className="text-gray-600 mb-2">
                            {message}
                        </p>

                        <p className="text-sm text-gray-500">
                            Redirecting to home page...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mb-6 text-6xl">
                            ❌
                        </div>

                        <h2 className="text-2xl font-bold text-red-600 mb-3">
                            Verification Failed
                        </h2>

                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition duration-200 hover:bg-blue-700"
                        >
                            Go to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;