import { useState, useEffect } from "react";

import type { Task } from "./ProjectMainContent";
import { useNotification } from "../context/NotificationContext";
import { createProgressNote, getProgressNotes, getUsersIDName, partialUpdateTask } from "../api/dashboard";
import { getErrorMessage } from "../utils/getErrorMessage";

export type ProgressNote = {
    created_by_full_name: string;
    note: string;
};

type User = {
    id: number;
    full_name: string;
};

type TaskModalProps = {
    task: Task | null;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    onClose: () => void;
};

const getInitials = (fullName?: string) => {
    if (!fullName) return "";

    const [lastName = "", firstName = ""] = fullName.split(",");

    return `${firstName.trim()[0] || ""}${lastName.trim()[0] || ""}`.toUpperCase();
};

const TaskModal = ({
    task,
    setTasks,
    onClose,
}: TaskModalProps) => {
    const { setNotification } = useNotification();
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [notes, setNotes] = useState<ProgressNote[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [note, setNote] = useState("");
    const [isEditingAssignee, setIsEditingAssignee] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(
        task?.assigned_to || null
    );
    const [savingAssignee, setSavingAssignee] = useState(false);

    const handleSaveNote = async () => {      
        if (!task) return null;
        try {
            const data = await createProgressNote({task: task.id, note: note});
        
            setNotification({
                type: "success",
                message: "Progress note added successfully!",
            });

            setNotes((prev) => [data, ...prev]);
            setNote("");

        } catch (err: unknown) {
    
            setNotification({
                type: "error",
                message: getErrorMessage(err),
            });
        }
    };

    useEffect(() => {
        if (!task) return;

        const fetchNotes = async () => {
            try {
                const data = await getProgressNotes({task: task.id});
                setNotes(data);
            } catch (err) {
                setNotification({
                    type: "error",
                    message: getErrorMessage(err),
                })
            }
        };

        fetchNotes();
    }, [task]);

    useEffect(() => {
        if (!task) return;

        const fetchUsers = async () => {
            try {
                const data = await getUsersIDName();
                setUsers(data);
            } catch (err) {
                setNotification({
                    type: "error",
                    message: getErrorMessage(err),
                })
            }
        };

        fetchUsers();
    }, [task]);

    const handleUpdateAssignee = async () => {
        if (!task) return;

        try {
            setSavingAssignee(true);

            const data = await partialUpdateTask({assigned_to: selectedUserId}, task.id);

            // update UI instantly
            setTasks((prev) =>
                prev.map((t) =>
                t.id === task.id
                    ? { ...t, assigned_to: data.assigned_to, assigned_to_full_name: data.assigned_to_full_name }
                    : t
                )
            );

            setIsEditingAssignee(false);

            setNotification({
                type: "success",
                message: "Assignee updated successfully!",
            });
        } catch (err) {
            setNotification({
                type: "error",
                message: getErrorMessage(err),
            });
        } finally {
            setSavingAssignee(false);
        }
    };

    if (!task) return null;

    const statusColors: Record<string, string> = {
        todo: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        done: "bg-green-500/20 text-green-300 border-green-500/30",
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#171717] shadow-2xl modern-scroll"
            >
                {/* Header */}
                <div className="border-b border-white/10 bg-gradient-to-r from-[#1f1f1f] to-[#262626] p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                        statusColors[task.status] ||
                                        "bg-gray-500/20 text-gray-300 border-gray-500/30"
                                    }`}
                                >
                                    {task.status}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white leading-tight">
                                {task.name}
                            </h2>

                            <p className="text-sm text-gray-400 mt-2">
                                Created by{" "}
                                <span className="text-gray-200">
                                    {task.created_by_full_name}
                                </span>
                            </p>
                        </div>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
                            Description
                        </h3>

                        <div className="rounded-xl bg-[#202020] border border-white/5 p-4">
                            <p className="text-gray-200 leading-relaxed text-sm">
                                {task.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Assigned */}
                    {!isEditingAssignee ? (
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#202020] px-3 py-2">
                            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                                {getInitials(task.assigned_to_full_name)}
                            </div>

                            <span className="text-sm text-gray-200">
                                {task.assigned_to_full_name || "Unassigned"}
                            </span>

                            <button
                                onClick={() => setIsEditingAssignee(true)}
                                className="ml-2 text-xs text-blue-400 hover:text-blue-300"
                            >
                                Change
                            </button>
                        </div>
                    ) : (                                    
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedUserId ?? ""}
                                onChange={(e) =>
                                    setSelectedUserId(
                                        e.target.value === "" ? null : Number(e.target.value)
                                    )
                                }
                                className="bg-[#202020] border border-white/10 text-sm text-white rounded-lg px-3 py-2"
                            >
                                <option value="">Unassigned</option>

                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.full_name}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={handleUpdateAssignee}
                                disabled={savingAssignee}
                                className="px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                {savingAssignee ? "Saving..." : "Save"}
                            </button>

                            <button
                                onClick={() => {
                                    setIsEditingAssignee(false);
                                    setSelectedUserId(task.assigned_to ?? null);
                                }}
                                className="px-3 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Progress Notes */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Progress Notes
                            </h3>

                            <button
                                onClick={() => setIsAddingNote(true)}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-sm font-medium text-white"
                            >
                                + Add Note
                            </button>
                        </div>
                        
                        {isAddingNote && (
                            <div className="mt-4 rounded-xl border border-white/10 bg-[#202020] p-4">
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Write a progress update..."
                                    className="w-full bg-transparent text-sm text-white outline-none resize-none min-h-[100px]"
                                />

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => {
                                            setIsAddingNote(false);
                                            setNote("");
                                        }}
                                        className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleSaveNote}
                                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isAddingNote && (
                            <div className="space-y-3">
                                {notes?.length ? (
                                    notes.map(
                                        (note: ProgressNote, index: number) => (
                                            <div
                                                key={index}
                                                className="group rounded-xl border border-white/5 bg-[#202020] hover:bg-[#252525] transition p-4"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Avatar */}
                                                    <div className="h-9 w-9 rounded-full bg-purple-500 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                                                        {note.created_by_full_name
                                                            ?.split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-white">
                                                            {note.created_by_full_name}
                                                        </div>

                                                        <p className="mt-1 text-sm leading-relaxed text-gray-300">
                                                            {note.note}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                                        <p className="text-sm text-gray-500">
                                            No progress notes yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )} 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;