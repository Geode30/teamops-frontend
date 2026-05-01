import LoginForm from "../forms/Login";
import AuthLayout from "../layouts/Auth";
import NotificationToast from "../components/NotificationToast";

export default function LoginPage() {

    return (
        <AuthLayout >
            <NotificationToast />
            <LoginForm />
        </AuthLayout>
    );
}