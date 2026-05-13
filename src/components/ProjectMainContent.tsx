import { useState, useEffect } from "react";
import { DndContext, closestCorners, DragOverlay, useDroppable, useDraggable, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { getTasks, partialUpdateTask } from "../api/dashboard";
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

interface DroppableColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const DraggableTask = ({ task }: { task: Task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging,
    } = useDraggable({
        id: task.id,
    });

    return (
        <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{
            opacity: isDragging ? 0 : 1,
        }}
        className="touch-none bg-[#1e1e1e] hover:bg-[#252525] transition-all p-3 rounded-lg shadow-sm cursor-pointer"
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
    );
};

const DroppableColumn = ({
    id,
    title,
    children,
    }: DroppableColumnProps) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div
        ref={setNodeRef}
        className="min-h-0 flex flex-col bg-[#161616] rounded-lg p-2"
        >
            <div className="flex items-center gap-2 mb-4">
                <span
                className={`w-2 h-2 rounded-full ${
                    id === "todo"
                    ? "bg-blue-500"
                    : id === "in_progress"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                />

                <h2 className="text-white font-semibold">
                {title}
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 modern-scroll">
                {children}
            </div>
        </div>
    );
};

export default function ProjectMainContent({
    selectedProjectId,
}: {
    selectedProjectId: number | string | null;
}){
    const { setNotification } = useNotification();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveTask(null);

        if (!over) return;
        if (typeof active.id !== "number") return;

        const taskId = Number(active.id);
        const newStatus = String(over.id);

        const currentTask = tasks.find((t) => t.id === taskId);

        if (!currentTask) return;

        if (currentTask.status === newStatus) return;

        const previousTasks = tasks;

        setTasks((prev) =>
            prev.map((t) =>
            t.id === taskId
                ? { ...t, status: newStatus }
                : t
            )
        );

        try {
            await partialUpdateTask({ status: newStatus }, taskId);
        } catch (err) {
            setNotification({
            type: "error",
            message: getErrorMessage(err),
            });

            setTasks(previousTasks);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
            distance: 5, // prevents accidental drag on click
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
            delay: 150,
            tolerance: 8,
            },
        })
    );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="h-full bg-[#121212] p-6 overflow-x-hidden">
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto xl:h-[calc(100vh-220px)]">

                {/* To Do */}
                <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={(event) => {
                    const task = tasks.find((t) => t.id === event.active.id);
                    setActiveTask(task || null);
                }}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveTask(null)}
                >
                    <DroppableColumn id="todo" title="To Do">
                        {tasks
                            .filter((t) => t.status === "todo")
                            .map((task) => (
                            <DraggableTask key={task.id} task={task} />
                        ))}
                    </DroppableColumn>

                    {/* In Progress */}
                    <DroppableColumn id="in_progress" title="In Progress">
                        {tasks
                            .filter((t) => t.status === "in_progress")
                            .map((task) => (
                            <DraggableTask key={task.id} task={task} />
                        ))}
                    </DroppableColumn>

                    {/* Completed */}
                    <DroppableColumn id="done" title="Completed">
                        {tasks
                            .filter((t) => t.status === "done")
                            .map((task) => (
                            <DraggableTask key={task.id} task={task} />
                        ))}
                    </DroppableColumn>
                
                    <DragOverlay>
                        {activeTask ? (
                            <div className="pointer-events-none w-full max-w-[300px] rotate-1 scale-105">
                                <div className="bg-[#252525] border border-[#3a3a3a] p-3 rounded-lg shadow-2xl opacity-95">
                                    
                                    <div className="text-sm text-gray-200 font-medium leading-snug">
                                        {activeTask.name}
                                    </div>

                                    {activeTask.description && (
                                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                            {activeTask.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>

                </DndContext>
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