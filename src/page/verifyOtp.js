import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verifyLoginOtpApi } from "../api/auth/twoFactorSlice";
import { otpVerifyScreenBg } from "../utils/utils";

const VerifyOtp = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const userId = location.state?.userId;

    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const handleVerifyOtp = async () => {

        if (!otp.trim()) {
            toast.error("Please enter OTP");
            return;
        }

        try {

            setLoading(true);

            const payload = {
                userId,
                otp,
            };

            const response =
                await verifyLoginOtpApi(
                    payload
                );

            localStorage.setItem(
                "accessToken",
                response.data.token
            );

            localStorage.setItem(
                "isloggedIn",
                "true"
            );

            toast.success(
                "Login Successful"
            );

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Invalid OTP"
            );

        } finally {

            setLoading(false);
        }
    };

   return (
    <div className="min-h-screen flex">

        {/* Left Side Image */}
        <div className="hidden md:block md:w-1/2">
            <img
                src={otpVerifyScreenBg}
                alt="OTP Verification"
                className="h-screen w-full object-cover"
            />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6">

            <div className="w-full max-w-md">

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">

                    {/* Logo */}
                    <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-2">
                        WhaleIQ
                    </h1>

                    <h2 className="text-2xl font-bold text-center text-white mb-2">
                        Verify OTP
                    </h2>

                    <p className="text-center text-gray-300 mb-8">
                        Enter the verification code from your
                        Google Authenticator app
                    </p>

                    {/* OTP Input */}
                    <input
                        type="text"
                        value={otp}
                        maxLength={6}
                        onChange={(e) =>
                            setOtp(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if(e.key === "Enter"){
                                handleVerifyOtp()
                            }
                        }}
                        placeholder="Enter 6-digit OTP"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-white/20
                            bg-white/10
                            px-4
                            py-3
                            text-white
                            placeholder:text-gray-400
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/30
                        "
                    />

                    {/* Verify Button */}
                    <button
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="
                            w-full
                            mt-6
                            rounded-xl
                            bg-blue-600
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                    {/* Security Note */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Protected by Two-Factor Authentication
                        </p>
                    </div>

                </div>

            </div>

        </div>

    </div>
);
};

export default VerifyOtp;