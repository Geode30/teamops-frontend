import { useState, useEffect } from "react";

import { getTasks } from "../api/dashboard";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useNotification } from "../context/NotificationContext";
import CreateTaskModal from "./CreateTaskModal";

export type Task = {
    id: number;
    name: string;
    description: string;
    status: string;
    full_name: string;
    assigned_to_full_name: string | null;
}

export default function ProjectMainContent({
    selectedProjectId,
}: {
    selectedProjectId: number | string | null;
}){
    const { setNotification } = useNotification();
    const [task, setTasks] = useState<Task[]>([]);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

    useEffect(() => {
        if (!selectedProjectId) return;

        const tryGetTasks = async () => {
            try {
                const data = await getTasks({ project: selectedProjectId });
                setTasks(data);
            } catch (err) {
                setNotification({
                    type: "error",
                    message: getErrorMessage(err),
                });
            }
        };

        tryGetTasks();

    }, [selectedProjectId]);

    const renderTasks = (status: string) => {
        return task
            .filter(task => task.status === status)
            .map(task => (
            <div
                key={task.id}
                className="bg-[#1e1e1e] hover:bg-[#252525] transition-all p-3 rounded-lg shadow-sm cursor-pointer"
                >
                {/* Task name */}
                <div className="text-sm text-gray-200 font-medium leading-snug">
                    {task.status === "done" ? (
                    <span className="line-through text-gray-500">
                        {task.name}
                    </span>
                    ) : (
                    task.name
                    )}
                </div>

                {/* Description */}
                {task.description && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                        </div>
                    )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-3">
                {task.assigned_to_full_name ? (
                    <div className="flex items-center gap-2 bg-[#2a2a2a] border border-[#3a3a3a] px-2 py-1 rounded-full max-w-full">
                    {/* Avatar */}
                    <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
                        {(() => {
                        const [lastName = "", firstName = ""] =
                            task.assigned_to_full_name.split(",");

                        return `${firstName.trim()[0] || ""}${
                            lastName.trim()[0] || ""
                        }`.toUpperCase();
                        })()}
                    </div>

                    {/* Name */}
                    <span className="text-xs text-gray-300 truncate">
                        {(() => {
                        const [lastName = "", firstName = ""] =
                            task.assigned_to_full_name.split(",");

                        return `${firstName.trim()} ${lastName.trim()}`;
                        })()}
                    </span>
                    </div>
                ) : (
                    <div />
                )}
                </div>
            </div>
        ));
    };

    const totalTasks = task.length;
    const completedTasks = task.filter(t => t.status === "done").length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="h-full bg-[#121212] p-6">
            <div className="flex items-start justify-between mb-6">

                {/* Left: Progress */}
                <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between mb-2">
                    <h1 className="text-white text-lg font-semibold">Project Progress</h1>
                    <span className="text-sm text-gray-400">
                        {completedTasks} / {totalTasks} completed
                    </span>
                    </div>

                    <div className="w-full h-2 bg-[#1e1e1e] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${progress}%` }}
                    />
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                    {progress}% complete
                    </div>
                </div>

                {/* Right: Add Task Button */}
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
                    onClick={() => setIsCreateTaskModalOpen(true)}
                >
                    + Add Task
                </button>

            </div>

            <div className="grid grid-cols-3 gap-6 h-full">

                {/* To Do */}
                <div className="bg-[#161616] rounded-lg p-3 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <h2 className="text-white font-semibold">To Do</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {renderTasks("todo")}
                    </div>
                </div>

                {/* In Progress */}
                <div className="bg-[#161616] rounded-lg p-3 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <h2 className="text-white font-semibold">In Progress</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {renderTasks("in_progress")}
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-[#161616] rounded-lg p-3 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <h2 className="text-white font-semibold">Completed</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {renderTasks("done")}
                    </div>
                </div>
            </div>

            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => setIsCreateTaskModalOpen(false)}
                projectId={selectedProjectId}
                onTaskCreated={(newTask) => {
                    setTasks((prev) => [newTask, ...prev]);
                }}
            />
        </div>
    );
}