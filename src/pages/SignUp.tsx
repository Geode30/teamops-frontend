import SignupForm from "../forms/SignUp";
import AuthLayout from "../layouts/Auth";
import { Alert } from "../components/Alert";
import { useNotification } from "../types/notification";

export default function SignUpPage() {
    const { notification, setNotification } = useNotification();

    return (
        <AuthLayout>
            {notification && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                    <Alert
                        variant={notification.type}
                        message={notification.message}
                    />
                </div>
            )}

            <SignupForm setNotification={setNotification} />
        </AuthLayout>
    );
}