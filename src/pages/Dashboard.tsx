import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import DashboardLayout from "../layouts/Dashboard";
import HeaderButton from "../components/HeaderButton";
import ProjectSidebar from "../components/ProjectSidebar";
import ProjectMainContent from "../components/ProjectMainContent";
import { currentUser, logout } from "../api/auth";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import NotificationToast from "../components/NotificationToast";
import ConfirmModal from "../components/ConfirmModal";
import ProfileModal from "../components/ProfileModal";
import { setAccessToken } from "../api/client.api";

export default function DashboardPage() {
    const { setNotification } = useNotification()
    const { setToken } = useAuth()
    const { user, setUser } = useAuth()
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | string | null>(null);

    useEffect(() => {
        const getCurrentUser = async () => {
          try {
            const data = await currentUser();
            setUser({
                id: data.id,
                username: data.username,
                firstName: data.first_name,
                lastName: data.last_name
            })
          } catch (error) {
            setNotification({
                type: "error",
                message: getErrorMessage(error),
            });
          }
        };
    
        getCurrentUser();
      }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setNotification({
                type: "success",
                message: "Logged out successfully",
            });
            setAccessToken(null)
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

            sidebar={<ProjectSidebar 
                selectedProjectId={selectedProjectId} 
                setSelectedProjectId={setSelectedProjectId} />}

            header={
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="text-xl font-bold">
                        TeamOps
                    </div>

                    <div className="flex items-center gap-3">
                        <HeaderButton className="flex items-center gap-4" onClick={() => setShowProfileModal(true)}>
                            <FaUserCircle className="text-xl" />
                            <span>{user?.firstName || "Profile"}</span>
                        </HeaderButton>
                        <HeaderButton onClick={() => setShowLogoutModal(true)}>Logout</HeaderButton>
                    </div>
                </div>
            }

        >
            <ProfileModal 
                open={showProfileModal}
                user={user}
                onClose={async () => {
                    setShowProfileModal(false);
                }}
            />

            <ConfirmModal
                open={showLogoutModal}
                title="Confirm Logout"
                message="Are you sure you want to log out of your account?"
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={async () => {
                    setShowLogoutModal(false);
                    await handleLogout();
                }}
            />
            <NotificationToast />
            <ProjectMainContent selectedProjectId={selectedProjectId} />
        </DashboardLayout>
    );
}