import { useState } from "react";

import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import AuthSwitchLink from "../components/AuthSwitchLink";
import { validateSignup } from "../utils/validators/SignUp";
import { useNotification } from "../context/NotificationContext";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { setAccessToken } from "../api/client.api";

import { signup } from "../api/auth";

export interface SignupFormData {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const { setToken } = useAuth();
  const { setNotification } = useNotification();
  const [form, setForm] = useState<SignupFormData>({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      username: form.username,
      confirm_password: form.confirmPassword,
      password: form.password,
    }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const error = validateSignup(form);

    if (error) {
      setNotification({ type: "error", message: error });
      return;
    }

    try {
      const response = await signup(payload);

      setNotification({
        type: "success",
        message: "Signup successful!",
      });

      setAccessToken(response.tokens.access)
      setToken({
        access: response.tokens.access,
      });

    } catch (err: unknown) {

      setNotification({
        type: "error",
        message: getErrorMessage(err),
      });
    }
  };

  return (
    <div className="w-full max-w-md bg-[#121212] border-2 border-white p-8 rounded-2xl shadow-md">
      
      <h2 className="text-2xl font-bold text-center mb-6">
        Create an account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="First Name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          required
        />

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

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <PrimaryButton type="submit">
          Sign Up
        </PrimaryButton>

        <AuthSwitchLink
          question="Already have an account?"
          linkText="Login"
          to="/login"
        />
      </form>
    </div>
  );
}