import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../api/auth/roomSlice";

const CreateRoom = () => {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            roomName: "",
            description: "",
            roomType: "voice",
            maxParticipants: 6,
            privacy: "private",
        });
    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async () => {

        if (!formData.roomName.trim()) {
            alert("Room name is required");
            return;
        }

        try {

            setLoading(true);

            const response =
                await createRoom(formData);

            navigate(
                `/rooms/${response.data.id}/lobby`
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

                <div className="text-center mb-8">

                    <div className="text-5xl mb-3">
                        🎙️
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        Create Voice Room
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Start a private room and invite your friends
                    </p>

                </div>

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Room Name
                        </label>

                        <input
                            name="roomName"
                            placeholder="Weekend Gossip"
                            value={formData.roomName}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="What is this room about?"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Room Type
                        </label>

                        <select
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="voice">
                                🎙 Voice Room
                            </option>

                            <option value="chat">
                                💬 Chat Only
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Maximum Participants
                        </label>

                        <select
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="6">
                                6 Participants
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Privacy
                        </label>

                        <select
                            name="privacy"
                            value={formData.privacy}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="private">
                                🔒 Invite Only
                            </option>

                            <option value="public">
                                🌍 Public
                            </option>
                        </select>
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="
        w-full
        bg-indigo-600
        hover:bg-indigo-700
        disabled:opacity-50
        disabled:cursor-not-allowed
        text-white
        font-semibold
        py-3
        rounded-xl
        transition
    "
                    >
                        {
                            loading
                                ? "Creating..."
                                : "Create Room"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CreateRoom;