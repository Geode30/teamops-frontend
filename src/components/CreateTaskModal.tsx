import { useEffect, useState } from "react";
import { getUsersIDName } from "../api/dashboard";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useNotification } from "../context/NotificationContext";
import { createTask } from "../api/dashboard";
import type { Task } from "./ProjectMainContent";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    projectId: number | string | null;
    onTaskCreated: (task: Task) => void;
};

type User = {
    id: number;
    full_name: string;
};

export default function CreateTaskModal({
    isOpen,
    onClose,
    projectId,
    onTaskCreated,
}: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [memberSearch, setMemberSearch] = useState("");
    const { setNotification } = useNotification();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "todo",
        assigned_to: null as number | null,
    });

    useEffect(() => {
        if (!isOpen) return;

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
    }, [isOpen]);

    const filteredUsers = users.filter((user) =>
        user.full_name
            .toLowerCase()
            .includes(memberSearch.toLowerCase())
    );

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!projectId) return;

        const payload = {
            project: projectId,
            name: formData.name,
            description: formData.description,
            status: formData.status,
            assigned_to: formData.assigned_to,
        };

        try {
            const data =await createTask(payload);
            onTaskCreated(data);
            setNotification({
                type: "success",
                message: "Task created successfully",
            })

            setFormData({
                name: "",
                description: "",
                status: "todo",
                assigned_to: null,
            });
            
            onClose();
        } catch (err) {
            setNotification({
                type: "error",
                message: getErrorMessage(err),
            })
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-lg rounded-2xl bg-[#1E1E1E] p-6 border border-white/10">

                <h2 className="text-xl font-semibold mb-6">
                    Create Task
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    {/* Name */}
                    <input
                        type="text"
                        placeholder="Task name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            })
                        }
                        className="bg-black/50 text-white border border-white/10 rounded-lg px-3 py-2"
                        required
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        className="bg-black/50 text-white border border-white/10 rounded-lg px-3 py-2"
                    />

                    {/* Status */}
                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value,
                            })
                        }
                        className="bg-black/50 text-white border border-white/10 rounded-lg px-3 py-2 [color-scheme:dark]"
                    >
                        <option value="todo" className="bg-zinc-900 text-white">
                            To Do
                        </option>

                        <option value="in_progress" className="bg-zinc-900 text-white">
                            In Progress
                        </option>

                        <option value="done" className="bg-zinc-900 text-white">
                            Done
                        </option>
                    </select>

                    {/* Assigned user search */}
                    <div className="flex flex-col gap-2">

                        <input
                            type="text"
                            placeholder="Search users..."
                            value={memberSearch}
                            onChange={(e) =>
                                setMemberSearch(e.target.value)
                            }
                            className="bg-black/50 text-white border border-white/10 rounded-lg px-3 py-2"
                        />

                        <div className="max-h-40 overflow-y-auto border border-white/10 rounded-lg">

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        assigned_to: null,
                                    })
                                }
                                className={`
                                    w-full text-left px-3 py-2 hover:bg-white/5
                                    ${
                                        formData.assigned_to === null
                                            ? "bg-white/10"
                                            : ""
                                    }
                                `}
                            >
                                Unassigned
                            </button>

                            {filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            assigned_to: user.id,
                                        })
                                    }
                                    className={`
                                        w-full text-left px-3 py-2 hover:bg-white/5
                                        ${
                                            formData.assigned_to === user.id
                                                ? "bg-white/10"
                                                : ""
                                        }
                                    `}
                                >
                                    {user.full_name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                        >
                            Create Task
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}