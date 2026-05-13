import { useState } from "react";

import { useNotification } from "../context/NotificationContext";
import { getErrorMessage } from "../utils/getErrorMessage";
import { validateCredentials } from "../utils/validators/Credentials";
import { updateCredentials } from "../api/user";
import FormInput from "../components/FormInput";
import type { User } from "../context/auth.context";

export interface CredentialsFormData {
  username: string,
  password: string,
  confirmPassword: string
}

type CredentialsFormProps = {
  user: User;
  onClose: () => void;
};

export default function CredentialsForm({
  user,
  onClose,
}: CredentialsFormProps) {
  const { setNotification } = useNotification();

  const [form, setForm] = useState<CredentialsFormData>({
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

  const handleSubmit = async () => {      
      const error = validateCredentials(form);

      const payload = {
        username: form.username,
        password: form.password,
        confirm_password: form.confirmPassword
      }
  
      if (error) {
        setNotification({ type: "error", message: error });
        return;
      }
  
      try {
        await updateCredentials(user.id, payload);
  
        setNotification({
          type: "success",
          message: "Credentials updated successfully!",
        });

        onClose();
  
      } catch (err: unknown) {
  
        setNotification({
          type: "error",
          message: getErrorMessage(err),
        });
      }
    };

  return (
    <div className="space-y-3">
      <FormInput
        name="username"
        label="Username"
        value={form.username}
        onChange={handleChange}
      />

      <FormInput
        name="password"
        type="password"
        label="New password"
        value={form.password}
        onChange={handleChange}
      />

      <FormInput
        name="confirmPassword"
        type="password"
        label="Confirm new password"
        value={form.confirmPassword}
        onChange={handleChange}
      />

      <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded">
        Update Credentials
      </button>
    </div>
  );
}