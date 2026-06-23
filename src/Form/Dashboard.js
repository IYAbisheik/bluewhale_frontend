import React, { useState, useEffect, useRef } from "react";
// import man from "../Assets/Images/man.png";
// import others from "../Assets/Images/transgender.png";
// import women from "../Assets/Images/woman.png";
import homePage from "../Assets/Images/homePage.jpg";
import { useNavigate } from "react-router-dom";
// import Card from "react-bootstrap/Card";
// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
import { toast } from "sonner";
import { disable2FAApi, generate2FAApi, verify2FAApi } from "../api/auth/twoFactorSlice";
// import { token } from "../utils/utils";
import { logout } from "../api/auth/authApi";
// import { Socket } from "socket.io-client";
import { disconnectSocket } from "../socket/socket";

const Dashboard = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const hiddenVideoRef = useRef(null);
    const canvasRef = useRef(null);

    // const [adminData, setAdminData] = useState([]);
    const [preview, setPreview] = useState(null);
    const [duration, setDuration] = useState(0);
    // const [isPlaying, setIsPlaying] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [otp, setOtp] = useState("");

    const loggedUser = JSON.parse(localStorage.getItem("Currentuser"));
    // const allUsers = JSON.parse(localStorage.getItem("Users")) || [];

    const userData = loggedUser?.users;

    useEffect(() => {
        // if (userData) {
        //     setAdminData(userData);
        // }

        if (loggedUser?.is2FAEnabled) {
            setIs2FAEnabled(true);
        }
    }, [loggedUser?.is2FAEnabled]);

    useEffect(() => {
        const closeMenu = () => setShowProfileMenu(false);

        if (showProfileMenu) {
            document.addEventListener("click", closeMenu);
        }

        return () => {
            document.removeEventListener("click", closeMenu);
        };
    }, [showProfileMenu]);
    const handleLogout = async () => {
        // if (window?.FB) {
        //     window.FB.logout(() => {
        //     })
        // }
        disconnectSocket();
        const response = await logout();
        console.log("LINE61", response);
        localStorage.clear();
        toast.success("Logout successfully");
        navigate("/");
    };

    const handleTimelineHover = (e) => {
        if (!duration) return;

        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const percentage = x / rect.width;

        const time = percentage * duration;

        hiddenVideoRef.current.currentTime = time;

        hiddenVideoRef.current.onseeked = () => {
            const canvas = canvasRef.current;

            const ctx = canvas.getContext("2d");

            canvas.width = 160;
            canvas.height = 90;

            ctx.drawImage(
                hiddenVideoRef.current,
                0,
                0,
                canvas.width,
                canvas.height
            );

            setPreview({
                x,
                image: canvas.toDataURL(),
                time,
            });
        };
    };

    const handleTimelineLeave = () => {
        setPreview(null);
    };

    const handle2FA = async () => {

        // Disable case
        if (is2FAEnabled) {

            try {

                const response =
                    await disable2FAApi();

                toast.success(
                    response.data.message
                );

                setIs2FAEnabled(false);

            } catch (error) {

                toast.error(
                    error.response?.data?.message
                );
            }

            return;
        }

        // Enable case
        try {

            const response =
                await generate2FAApi();

            setQrCode(
                response.data.qrCode
            );

            setShowQRModal(true);

        } catch (error) {

            toast.error(
                error.response?.data?.message
            );
        }
    };

    const handleVerify2FA = async () => {

        if (!otp.trim()) {
            toast.error("Enter OTP");
            return;
        }

        try {

            const response =
                await verify2FAApi({
                    token: otp,
                });

            toast.success(
                response.data.message ||
                "2FA Enabled Successfully"
            );

            setIs2FAEnabled(true);
            setShowQRModal(false);
            setOtp("");

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Invalid OTP"
            );
        }
    };

    // const handleDelete = (userid) => {
    //     const updatedData = adminData.filter(
    //         (user) => userid !== user.userid
    //     );

    //     const updatedCurrent = {
    //         ...loggedUser,
    //         users: updatedData,
    //     };

    //     const updatedAll = allUsers.map((user) =>
    //         user.id === loggedUser.id ? updatedCurrent : user
    //     );

    //     setAdminData(updatedData);

    //     localStorage.setItem(
    //         "Currentuser",
    //         JSON.stringify(updatedCurrent)
    //     );

    //     localStorage.setItem(
    //         "Users",
    //         JSON.stringify(updatedAll)
    //     );

    //     toast.success("User deleted successfully");
    // };

    // const handleEdit = (userid) => {
    //     navigate(`/edituser/${userid}`);
    // };

    return (
        <div
            className="min-h-screen flex flex-col items-center gap-10 bg-cover bg-center bg-no-repeat py-4"
            style={{
                backgroundImage: `url(${homePage})`,
            }}
        >
            {/* Header Section */}
            <div className="w-[95%] h-60 border-gray-300 rounded-xl shadow-lg">
                <div className="flex items-center justify-between px-8 py-6">

                    {/* Logo / Title */}
                    <h1 className="text-4xl font-extrabold text-blue-700 tracking-wide">
                        WhaleIQ
                    </h1>

                    {/* Profile Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() =>
                                setShowProfileMenu(!showProfileMenu)
                            }
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-700 text-white text-xl font-bold shadow-md hover:bg-blue-800 transition"
                        >
                            {loggedUser?.firstname
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                                <button
                                    onClick={() => {
                                        handle2FA();
                                        setShowProfileMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-100"
                                >
                                    {is2FAEnabled
                                        ? "Disable 2FA"
                                        : "Enable 2FA"}
                                </button>

                                <button
                                    className="w-full px-4 py-3 text-left hover:bg-gray-100"
                                    onClick={() => navigate("/play-uno")}>
                                    Play uno🃏
                                </button>

                                <button
                                    onClick={() => {
                                        handleLogout()
                                        // setShowProhandleLogoutfileMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        {
                            showQRModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                                    <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">

                                        <h2 className="text-2xl font-bold text-center mb-4">
                                            Enable 2FA
                                        </h2>

                                        <div className="flex justify-center">
                                            <img
                                                src={qrCode}
                                                alt="2FA QR Code"
                                                className="w-64 h-64"
                                            />
                                        </div>

                                        <p className="text-center text-gray-600 mt-4">
                                            Scan this QR code using Google Authenticator
                                        </p>

                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(e.target.value)
                                            }
                                            placeholder="Enter OTP"
                                            maxLength={6}
                                            className="w-full mt-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        <div className="flex gap-3 mt-5">

                                            <button
                                                onClick={handleVerify2FA}
                                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                            >
                                                Verify OTP
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setShowQRModal(false);
                                                    setOtp("");
                                                }}
                                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            )
                        }
                    </div>

                </div>
            </div>

            <div className="flex gap-4">

                <button
                    onClick={() =>
                        navigate("/create-room")
                    }
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    Create Room
                </button>

                <button
                    onClick={() =>
                        navigate("/join-room")
                    }
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                    Join Room
                </button>

            </div>

            <div className="w-[95%] rounded-2xl overflow-hidden bg-black shadow-xl">

                <video
                    ref={videoRef}
                    controls
                    className="w-full h-[500px]"
                    onLoadedMetadata={() =>
                        setDuration(videoRef.current.duration)
                    }
                >
                    <source src={"/file_example_MP4_640_3MG.mp4"} type="video/mp4" />
                </video>

                {/* Timeline Preview Area */}
                <div
                    className="relative h-6 cursor-pointer"
                    onMouseMove={handleTimelineHover}
                    onMouseLeave={handleTimelineLeave}
                >
                    {preview && (
                        <div
                            className="absolute bottom-8 -translate-x-1/2"
                            style={{ left: preview.x }}
                        >
                            <img
                                src={preview.image}
                                alt="preview"
                                className="w-40 rounded-lg border border-white shadow-2xl"
                            />

                            <div className="bg-black text-white text-xs text-center py-1 rounded-b-lg">
                                {Math.floor(preview.time / 60)}:
                                {String(
                                    Math.floor(preview.time % 60)
                                ).padStart(2, "0")}
                            </div>
                        </div>
                    )}
                </div>
                <video
                    ref={hiddenVideoRef}
                    src={"/file_example_MP4_640_3MG.mp4"}
                    style={{ display: "none" }}
                />

                <canvas
                    ref={canvasRef}
                    style={{ display: "none" }}
                />

            </div>
        </div>
    );
};

export default Dashboard;