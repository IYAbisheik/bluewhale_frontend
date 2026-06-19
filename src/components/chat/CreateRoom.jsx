import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../api/auth/roomSlice";

const CreateRoom = () => {

    const [roomName, setRoomName] =
        useState("");

    const navigate = useNavigate();

    const handleCreateRoom =
        async () => {

            try {

                const response =
                    await createRoom({
                        roomName,
                    });

                navigate(
                    "/room-created",
                    {
                        state:
                            response?.data,
                    }
                );

            } catch (error) {

                console.log(error);

            }

        };

    return (
        <>
            <input
                value={roomName}
                onChange={(e) =>
                    setRoomName(
                        e.target.value
                    )
                }
            />

            <button
                onClick={
                    handleCreateRoom
                }
            >
                Create Room
            </button>
        </>
    );
};

export default CreateRoom;