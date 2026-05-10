import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjectsIdName } from "../api/dashboard";
import { getErrorMessage } from "../utils/getErrorMessage";
import CreateProjectModal from "./CreateProjectModal";

type ProjectIdName = {
    id: number | string;
    name: string;
};

type Props = {
    selectedProjectId: number | string | null;
    setSelectedProjectId: (id: number | string) => void;
};

export default function ProjectSidebar({
    selectedProjectId,
    setSelectedProjectId,
}: Props) {
    const [projectsIdName, setProjectsIdName] = useState<ProjectIdName[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const tryGetProjects = async () => {
            try {
                const data = await getProjectsIdName();
                setProjectsIdName(data);
            } catch (err) {
                console.log(getErrorMessage(err));
            }
        };

        tryGetProjects();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4">

                {/* Header row */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Projects</h2>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-1 hover:bg-white/10 rounded"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {/* Project list */}
                <div className="flex flex-col gap-1 mt-3">
                    {projectsIdName.map((project) => (
                        <button
                            key={project.id}
                            onClick={() => setSelectedProjectId(project.id)}
                            className={`
                                group
                                text-left
                                px-3 py-2
                                rounded-xl
                                transition-all duration-200 ease-out
                                border
                                active:scale-[0.98]
                                ${
                                    selectedProjectId === project.id
                                        ? "bg-white/15 border-white/30"
                                        : "bg-white/[0.02] border-transparent hover:bg-white/06 hover:border-white/10"
                                }
                            `}
                        >
                            <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                                {project.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={(newProject) => {
                    setProjectsIdName((prev) => [newProject, ...prev]);
                }}
            />
        </>
    );
}