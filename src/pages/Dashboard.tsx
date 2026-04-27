import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/Dashboard";
import HeaderButton from "../components/HeaderButton";
import ProjectSidebar from "../components/ProjectSidebar";
import { logout } from "../api/auth";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
    const { setToken } = useAuth()
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            setToken(null)
            navigate("/login");
        } catch (error) {
            console.log(getErrorMessage(error))
        }
    };


    return (
        <DashboardLayout

            sidebar={<ProjectSidebar />}

            header={
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="text-xl font-bold">
                        TeamOps
                    </div>

                    <div className="flex items-center gap-3">
                        <HeaderButton>Profile</HeaderButton>
                        <HeaderButton onClick={handleLogout}>Logout</HeaderButton>
                    </div>
                </div>
            }

        >
            <div>
                Main content goes here
            </div>
        </DashboardLayout>
    );
}