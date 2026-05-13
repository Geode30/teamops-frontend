import { useEffect, useState } from "react";
import { getErrorMessage } from "../utils/getErrorMessage";
import { getUsersIDName } from "../api/dashboard";
import { createProject } from "../api/dashboard";
import type { CreateProjectPayload } from "../api/dashboard";
import { useNotification } from "../context/NotificationContext";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated: (project: {
        id: number | string;
        name: string;
    }) => void;
};

type User = {
    id: number;
    full_name: string;
};

export default function CreateProjectModal({
    isOpen,
    onClose,
    onProjectCreated,
}: Props) {
    const { setNotification } = useNotification()
    const [users, setUsers] = useState<User[]>([]);
    const [memberSearch, setMemberSearch] = useState("");

    const [formData, setFormData] = useState<CreateProjectPayload>({
        name: "",
        description: "",
        status: "active",
        priority: "low",
        deadline: null,
        members: [] as number[],
    });

    useEffect(() => {
        if (!isOpen) return;

        const fetchUsers = async () => {
            try {
                const data = await getUsersIDName();
                setUsers(data);
            } catch (err) {
                console.log(getErrorMessage(err))
            }
        };

        fetchUsers();
    }, [isOpen]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleMember = (userId: number) => {
        setFormData((prev) => ({
            ...prev,
            members: prev.members.includes(userId)
                ? prev.members.filter((id) => id !== userId)
                : [...prev.members, userId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                deadline: formData.deadline
                    ? new Date(formData.deadline).toISOString()
                    : null,
            };

            const data = await createProject(payload);
            onProjectCreated({
                id: data.id,
                name: data.name,
            });
            setNotification({
                type: "success",
                message: "Project created successfully",
            })

            onClose();
        } catch (err) {
            setNotification({
                type: "error",
                message: getErrorMessage(err),
            })
        }
    };

    const filteredUsers = users.filter((user) =>
        user.full_name.toLowerCase().includes(memberSearch.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-lg rounded-2xl bg-[#1E1E1E] p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-6">
                    Create Project
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Project name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2"
                        required
                    />

                    {/* Description */}
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2"
                    />

                    {/* Status */}
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="bg-black/30 text-white border border-white/10 rounded-lg px-3 py-2"
                    >
                        <option value="active" className="bg-zinc-900 text-white">Active</option>
                        <option value="completed" className="bg-zinc-900 text-white">Completed</option>
                    </select>

                    {/* Priority */}
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="bg-black/30 text-white border border-white/10 rounded-lg px-3 py-2"
                    >
                        <option value="low" className="bg-zinc-900 text-white">Low</option>
                        <option value="medium" className="bg-zinc-900 text-white">Medium</option>
                        <option value="high" className="bg-zinc-900 text-white">High</option>
                    </select>

                    {/* Deadline */}
                    <input
                        type="datetime-local"
                        name="deadline"
                        value={formData.deadline ?? ""}
                        onChange={handleChange}
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 [color-scheme:dark]"
                    />

                    {/* Members */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm text-white/70">
                            Members
                        </label>

                        {/* Search input */}
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            className="
                                bg-black/30
                                border border-white/10
                                rounded-lg
                                px-3 py-2
                                outline-none
                                focus:border-white/30
                            "
                        />

                        {/* Selected users */}
                        {formData.members.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.members.map((memberId) => {
                                    const user = users.find((u) => u.id === memberId);

                                    if (!user) return null;

                                    return (
                                        <div
                                            key={user.id}
                                            className="
                                                flex items-center gap-2
                                                bg-white text-black
                                                px-3 py-1 rounded-full
                                                text-sm
                                            "
                                        >
                                            <span>{user.full_name}</span>

                                            <button
                                                type="button"
                                                onClick={() => toggleMember(user.id)}
                                                className="font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Search results */}
                        <div
                            className="
                                max-h-48 overflow-y-auto
                                border border-white/10
                                rounded-lg
                                divide-y divide-white/5
                            "
                        >
                            {filteredUsers
                                .filter(
                                    (user) => !formData.members.includes(user.id)
                                )
                                .map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => toggleMember(user.id)}
                                        className="
                                            w-full text-left
                                            px-3 py-2
                                            hover:bg-white/5
                                            transition
                                        "
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
                            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}