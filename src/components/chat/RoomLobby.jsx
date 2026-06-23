import React, {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

// import {
//     getSocket
// } from "../../socket";

import {
    getRoomById,
    getRoomMembers
} from "../../api/auth/roomSlice";
import { getSocket } from "../../socket/socket";

const positions = [
    "top-[5%] left-1/2 -translate-x-1/2",
    "top-[25%] right-[5%]",
    "bottom-[25%] right-[5%]",
    "bottom-[5%] left-1/2 -translate-x-1/2",
    "bottom-[25%] left-[5%]",
    "top-[25%] left-[5%]",
];

const RoomLobby = () => {

    const { roomId } =
        useParams();

                console.log("LINE197", roomId);
    const navigate =
        useNavigate();

    const [room, setRoom] =
        useState(null);

    const [members,
        setMembers] =
        useState([]);

    useEffect(() => {

        loadRoom();

        const socket =
            getSocket();

        if (!socket) return;

        socket.emit(
            "join-room",
            roomId
        );

        socket.on(
            "user-joined",
            (user) => {

                setMembers(
                    (prev) => {

                        const exists =
                            prev.find(
                                (m) =>
                                    m.user.id ===
                                    user.id
                            );

                        if (exists)
                            return prev;

                        return [
                            ...prev,
                            {
                                user
                            }
                        ];

                    }
                );

            }
        );

        socket.on(
            "user-left",
            (userId) => {

                setMembers(
                    (prev) =>
                        prev.filter(
                            (m) =>
                                m.user.id !==
                                userId
                        )
                );

            }
        );

        return () => {

            socket.off(
                "user-joined"
            );

            socket.off(
                "user-left"
            );

        };

    }, [roomId]);

    const loadRoom =
        async () => {

            try {

                const roomRes =
                    await getRoomById(
                        roomId
                    );

                const memberRes =
                    await getRoomMembers(
                        roomId
                    );

                setRoom(
                    roomRes.data
                );

                setMembers(
                    memberRes.data
                );

            } catch (error) {

                console.log(error);

            }

        };

    const copyInviteCode =
        async () => {

            try {

                await navigator
                    .clipboard
                    .writeText(
                        room.inviteCode
                    );

                alert(
                    "Invite code copied!"
                );

            } catch (error) {

                console.log(error);

            }

        };

    const handleLeave =
        () => {

            const socket =
                getSocket();

            socket.emit(
                "leave-room",
                roomId
            );

            navigate(
                "/dashboard"
            );

        };

    if (!room)
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Loading...
            </div>
        );
        
    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* HEADER */}

            <div className="border-b border-slate-800 px-8 py-4 flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">
                        🎙 {room.roomName}
                    </h1>

                    <p className="text-slate-400 mt-1">
                        Members:
                        {" "}
                        {members.length}
                        /6
                    </p>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={
                            copyInviteCode
                        }
                        className="bg-indigo-600 px-4 py-2 rounded-lg"
                    >
                        Copy Invite
                    </button>

                    <button
                        onClick={
                            handleLeave
                        }
                        className="bg-red-600 px-4 py-2 rounded-lg"
                    >
                        Leave
                    </button>

                </div>

            </div>

            {/* INVITE CODE */}

            <div className="text-center py-5">

                <p className="text-slate-400">
                    Invite Code
                </p>

                <h2 className="text-2xl font-bold tracking-widest">
                    {
                        room.inviteCode
                    }
                </h2>

            </div>

            {/* ROUND TABLE */}

            <div className="flex justify-center items-center mt-10">

                <div className="relative w-[600px] h-[600px]">

                    {/* TABLE */}

                    <div
                        className="
                        absolute
                        top-1/2
                        left-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        w-64
                        h-64
                        rounded-full
                        bg-slate-800
                        border
                        border-slate-700
                        flex
                        items-center
                        justify-center
                        text-xl
                        font-bold
                    "
                    >
                        🎙 Voice Room
                    </div>

                    {/* PARTICIPANTS */}

                    {members.map(
                        (
                            member,
                            index
                        ) => (

                            <div
                                key={
                                    member
                                        .user
                                        .id
                                }
                                className={`
                                    absolute
                                    ${positions[index]}
                                `}
                            >

                                <div
                                    className="
                                        w-20
                                        h-20
                                        rounded-full
                                        bg-indigo-600
                                        flex
                                        items-center
                                        justify-center
                                        text-2xl
                                        font-bold
                                        border-4
                                        border-green-400
                                    "
                                >
                                    {
                                        member
                                            .user
                                            .name[0]
                                    }
                                </div>

                                <p
                                    className="
                                    text-center
                                    mt-2
                                    text-sm
                                "
                                >
                                    {
                                        member
                                            .user
                                            .name
                                    }
                                </p>

                            </div>

                        )
                    )}

                </div>

            </div>

            {/* FOOTER CONTROLS */}

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">

                <button
                    className="
                    bg-slate-800
                    px-6
                    py-3
                    rounded-full
                "
                >
                    🎤 Mute
                </button>

                <button
                    className="
                    bg-slate-800
                    px-6
                    py-3
                    rounded-full
                "
                >
                    🎧 Audio
                </button>

            </div>

        </div>
    );

};

export default RoomLobby;