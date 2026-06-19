import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../../api/auth/roomSlice";

const JoinRoom = () => {

    const [inviteCode,
        setInviteCode] =
        useState("");

    const navigate =
        useNavigate();

    const handleJoinRoom =
        async () => {

            try {

                const response =
                    await joinRoom({
                        inviteCode,
                    });

                navigate(
                    `/room/${response?.data?.id}`
                );

            } catch (error) {

                console.log(error);

            }

        };

    return (
        <>
            <input
                value={inviteCode}
                onChange={(e) =>
                    setInviteCode(
                        e.target.value
                    )
                }
            />

            <button
                onClick={
                    handleJoinRoom
                }
            >
                Join Room
            </button>
        </>
    );
};

export default JoinRoom;