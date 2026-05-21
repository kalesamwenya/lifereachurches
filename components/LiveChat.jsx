"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Send, Users, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const API_URL = "https://content.lifereachchurch.org";

export default function Livestreams({ streamId }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [viewerCount, setViewerCount] = useState(0);
    const [sending, setSending] = useState(false);
    const [joined, setJoined] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const sessionId =
        typeof window !== "undefined"
            ? localStorage.getItem("live_session") || crypto.randomUUID()
            : "";

    useEffect(() => {
        localStorage.setItem("live_session", sessionId);
    }, []);

    useEffect(() => {
        const savedName = localStorage.getItem("live_username");
        if (savedName) {
            setUsername(savedName);
            setJoined(true);
        }
    }, []);

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmoji(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const joinChat = () => {
        if (!username.trim()) return;
        localStorage.setItem("live_username", username);
        setJoined(true);
    };

    const loadMessages = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/streams/get_messages.php?stream_id=${streamId}`
            );
            if (response.data.success) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateViewer = async () => {
        try {
            await axios.post(
                `${API_URL}/streams/viewer_heartbeat.php`,
                {
                    stream_id: streamId,
                    session_id: sessionId,
                    username
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const loadViewerCount = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/streams/get_viewers.php?stream_id=${streamId}`
            );
            if (response.data.success) {
                setViewerCount(response.data.count);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!streamId) return;

        loadMessages();
        loadViewerCount();
        updateViewer();

        const messageInterval = setInterval(loadMessages, 2000);
        const viewerInterval = setInterval(() => {
            updateViewer();
            loadViewerCount();
        }, 10000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(viewerInterval);
        };
    }, [streamId]);

    useEffect(() => {
        if (!chatContainerRef.current) return;
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = async () => {
        if (!message.trim() || !joined) return;

        try {
            setSending(true);
            await axios.post(
                `${API_URL}/streams/send_message.php`,
                {
                    stream_id: streamId,
                    session_id: sessionId,
                    username,
                    message
                }
            );
            setMessage("");
            loadMessages();
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    // Extract selected emoji characters directly from package object callback
    const onEmojiClick = (emojiData) => {
        const emoji = emojiData.emoji; 
        const input = inputRef.current;
        if (!input) {
            setMessage((prev) => prev + emoji);
            return;
        }

        const start = input.selectionStart;
        const end = input.selectionEnd;

        const newMsg =
            message.substring(0, start) +
            emoji +
            message.substring(end);

        setMessage(newMsg);

        setTimeout(() => {
            input.focus();
            input.selectionStart = input.selectionEnd = start + emoji.length;
        }, 0);
    };

    if (!joined) {
        return (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 h-[700px] flex items-center justify-center p-6">
                <div className="w-full max-w-sm text-center space-y-4">
                    <h2 className="text-white text-xl font-bold">Join Live Chat</h2>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your name..."
                        className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent"
                    />
                    <button
                        onClick={joinChat}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Join Chat
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 h-[700px] flex flex-col relative">
            
            {/* HEADER */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-2xl">
                <h3 className="font-bold text-white text-sm tracking-wide">Live Chat</h3>
                <div className="flex items-center gap-2 text-xs bg-gray-800/60 px-3 py-1 rounded-full text-gray-300 border border-gray-700/50">
                    <Users size={12} className="text-orange-500" />
                    <span>{viewerCount} watching</span>
                </div>
            </div>

            {/* CHAT CONTAINER */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-800">
                {messages.map((msg) => (
                    <div key={msg.id} className="text-sm break-words leading-relaxed">
                        <span className="text-orange-400 text-xs font-bold mr-2 bg-orange-500/5 px-1.5 py-0.5 rounded border border-orange-500/10">
                            {msg.username}
                        </span>
                        <span className="text-gray-200 text-[13px]">{msg.message}</span>
                    </div>
                ))}
            </div>

            {/* BAR ACTIONS INPUT BAR */}
            <div className="p-4 border-t border-gray-800 flex gap-2 relative bg-gray-950/20 rounded-b-2xl">
                
                {/* Popover wrapper block containing emoji package instance */}
                {showEmoji && (
                    <div 
                        ref={emojiPickerRef} 
                        className="absolute bottom-16 left-4 z-50 shadow-2xl rounded-xl overflow-hidden border border-gray-700 max-w-[320px] md:max-w-[350px] animate-in fade-in slide-in-from-bottom-2 duration-150"
                    >
                        <EmojiPicker 
                            theme="dark"
                            onEmojiClick={onEmojiClick}
                            autoFocusSearch={false}
                            height={380}
                            width="100%"
                            previewConfig={{ showPreview: false }} // Hides large thumbnail preview for a cleaner compact size
                        />
                    </div>
                )}

                {/* Popover trigger button */}
                <button
                    onClick={() => setShowEmoji(!showEmoji)}
                    className={`p-3 rounded-xl border transition-colors ${
                        showEmoji 
                            ? "bg-gray-800 border-orange-500/40 text-orange-400" 
                            : "bg-gray-800 border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white"
                    }`}
                    title="Add Emoji"
                >
                    <Smile size={18} />
                </button>

                <input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                    placeholder="Type message..."
                    className="flex-1 bg-gray-800 border border-gray-700 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-gray-600"
                />

                <button
                    onClick={sendMessage}
                    disabled={sending || !message.trim()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 transition-colors px-5 rounded-xl text-white font-medium flex items-center justify-center"
                >
                    <Send size={16} />
                </button>
            </div>

        </div>
    );
}