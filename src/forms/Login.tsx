import { useState } from "react";
import type { ChangeEvent, SyntheticEvent  } from "react";

import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import AuthSwitchLink from "../components/AuthSwitchLink";
import { validateLogin } from "../utils/validators/Login";
import { login } from "../api/auth";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import { setAccessToken } from "../api/client.api";

export interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const { setNotification } = useNotification();
  const { setToken } = useAuth();

  const [form, setForm] = useState<LoginFormData>({
    username: "",
    password: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateLogin(form);
    if (error) {
      setNotification({ type: "error", message: error });
      return;
    }

    try {
      const response = await login({
        username: form.username,
        password: form.password,
      });

      setNotification({
        type: "success",
        message: "Login successful!",
      });
      setAccessToken(response.access)
      setToken({
        access: response.access,
      });

    } catch (err: unknown) {
      setNotification({
        type: "error",
        message: getErrorMessage(err),
      });
    }
}

  return (
    <div className="w-full max-w-md bg-[#121212] border-2 border-white p-8 rounded-2xl shadow-md">        
      <h2 className="text-2xl font-bold text-center mb-6">
        Sign In
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <PrimaryButton type="submit">
          Login
        </PrimaryButton>
      </form>

      <AuthSwitchLink
        question="Don’t have an account?"
        linkText="Sign Up"
        to="/register"
      />

    </div>
  );
}