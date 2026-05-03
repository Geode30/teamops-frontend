import { useState } from "react";

import { validateProfile } from "../utils/validators/Profile";
import { useNotification } from "../context/NotificationContext";
import { updateUser } from "../api/user";
import { getErrorMessage } from "../utils/getErrorMessage";
import FormInput from "../components/FormInput";
import { useAuth } from "../hooks/useAuth";

export interface ProfileFormData {
  firstName: string,
  lastName: string
}

export default function ProfileForm({ user, onClose }) {
  const { setNotification } = useNotification();
  const { setUser } = useAuth();

  const [form, setForm] = useState<ProfileFormData>({
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {      
    const error = validateProfile(form);

    const payload = {
      first_name: form.firstName,
      last_name: form.lastName
    }

    if (error) {
      setNotification({ type: "error", message: error });
      return;
    }

    try {
      const hasChanges =
        user.firstName.trim() !== form.firstName.trim() ||
        user.lastName.trim() !== form.lastName.trim();

      if (hasChanges) {
        await updateUser(user.id, payload);
        setUser((prev) => {
          if (!prev) return prev; 

          return {
            ...prev,
            firstName: form.firstName,
            lastName: form.lastName,
          };
        });

        setNotification({
          type: "success",
          message: "User profile updated successfully!",
        });
      }
      else {
         setNotification({
            type: "warning",
            message: "No changes detected.",
        });
      }

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
        name="firstName"
        label="First name"
        value={form.firstName}
        onChange={handleChange}
      />

      <FormInput
        name="lastName"
        label="Last name"
        value={form.lastName}
        onChange={handleChange}
      />

      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
        Save
      </button>
    </div>
  );
}