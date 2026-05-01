import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjectsIdName } from "../api/dashboard";
import { getErrorMessage } from "../utils/getErrorMessage";

type ProjectIdName = {
    id: number | string;
    name: string;
};

export default function ProjectSidebar() {
    const [projectsIdName, setProjectsIdName] = useState<ProjectIdName[]>([]);

    useEffect(() => {
        const tryGetProjects = async () => {
          try {
            const data = await getProjectsIdName();
            setProjectsIdName(data);
          } catch (err) {
            console.log(getErrorMessage(err))
          }
        };
    
        tryGetProjects();
      }, []);

    return (
        <div className="flex flex-col gap-4">

            {/* Header row */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Projects</h2>

                <button className="p-1 hover:bg-white/10 rounded">
                    <Plus size={18} />
                </button>
            </div>

            {/* Project list */}
            <div className="flex flex-col gap-2 mt-2">
                {projectsIdName.map((project) => (
                    <button
                        key={project.id}
                        className="text-left px-2 py-1 rounded hover:bg-white/10"
                    >
                        {project.name}
                    </button>
                ))}
            </div>
        </div>
    );
}