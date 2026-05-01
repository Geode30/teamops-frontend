import SignupForm from "../forms/SignUp";
import AuthLayout from "../layouts/Auth";
import NotificationToast from "../components/NotificationToast";

export default function SignUpPage() {
    return (
        <AuthLayout>
            <NotificationToast />
            <SignupForm />
        </AuthLayout>
    );
}