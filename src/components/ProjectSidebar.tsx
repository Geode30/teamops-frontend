import { Plus } from "lucide-react";

export default function ProjectSidebar() {
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
                <button className="text-left px-2 py-1 rounded hover:bg-white/10">
                    Project Alpha
                </button>

                <button className="text-left px-2 py-1 rounded hover:bg-white/10">
                    Project Beta
                </button>

                <button className="text-left px-2 py-1 rounded hover:bg-white/10">
                    Project Gamma
                </button>
            </div>

        </div>
    );
}