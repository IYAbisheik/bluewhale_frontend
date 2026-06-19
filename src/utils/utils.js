import React from "react"

export const bgImg = "https://outer-cyan-sjyljau6dj.edgeone.app/RouterApp%27s%20bg.jpg"

export const signUpBgImage = "https://fundamental-azure-tspbn2owji.edgeone.app/chinh-le-duc-P19iVmm7XUA-unsplash.jpg"

export const signUpBgVideo = "https://www.image2url.com/r2/default/videos/1776411007961-f745f1e4-4124-41a0-9a5f-68862bf66b1e.mp4"

// export const otpVerifyScreenBg = "https://images.unsplash.com/photo-1712233698587-0fcf4b2457dd?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
export const otpVerifyScreenBg = "https://images.unsplash.com/photo-1698334846753-cc817a5277be?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
export const token = localStorage.getItem("accessToken") || "";

export const InputField = ({
    icon: Icon,
    endIcon,
    type = "text",
    name,
    value,
    placeholder,
    onChange,
    focusedField,
    setFocusedField,
}) => {
    const isFocused = focusedField === name;

    return (
        <div
            className={`group flex items-center rounded-xl bg-white px-4 py-3 shadow-md transition-all duration-300 ${
                isFocused
                    ? "ring-2 ring-blue-500 shadow-blue-200/50"
                    : "hover:shadow-lg"
            }`}
        >
            {/* Left Icon */}
            <div
                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                    isFocused
                        ? "bg-blue-100 scale-110 -translate-y-1"
                        : "bg-gray-100"
                }`}
            >
                <Icon
                    size={20}
                    className={`transition-all duration-300 ${
                        isFocused
                            ? "text-blue-600 scale-110"
                            : "text-gray-500"
                    }`}
                />
            </div>

            {/* Input */}
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField("")}
                onChange={onChange}
            />

            {/* Right Icon */}
            {endIcon && (
                <div className="ml-3 flex items-center">
                    {endIcon}
                </div>
            )}
        </div>
    );
};