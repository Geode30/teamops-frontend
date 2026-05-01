import DashboardLayout from "../layouts/Dashboard";
import HeaderButton from "../components/HeaderButton";
import ProjectSidebar from "../components/ProjectSidebar";
import { logout } from "../api/auth";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import NotificationToast from "../components/NotificationToast";

export default function DashboardPage() {
    const { setNotification } = useNotification()
    const { setToken } = useAuth()

    const handleLogout = async () => {
        try {
            await logout();
            setNotification({
                type: "success",
                message: "Logged out successfully",
            });
            setToken(null)
        } catch (error) {
            setNotification({
                type: "error",
                message: getErrorMessage(error),
            });
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
            <NotificationToast />
            <div>
                Main content goes here
            </div>
        </DashboardLayout>
    );
}