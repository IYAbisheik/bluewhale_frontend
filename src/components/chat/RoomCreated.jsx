import React from "react";
import { useLocation } from "react-router-dom";

const RoomCreated = () => {

    const { state } =
        useLocation();

    const copyCode = () => {

        navigator.clipboard.writeText(
            state.inviteCode
        );

        alert(
            "Invite Code Copied"
        );

    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-[500px] text-center">

                <h2 className="text-3xl font-bold mb-5">
                    Room Created 🎉
                </h2>

                <div className="bg-gray-100 p-4 rounded-lg text-xl font-semibold">

                    {state.inviteCode}

                </div>

                <button
                    onClick={copyCode}
                    className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                    Copy Invite Code
                </button>

            </div>

        </div>
    );
};

export default RoomCreated;