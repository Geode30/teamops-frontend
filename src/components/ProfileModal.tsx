import { useState } from "react";

import ProfileForm from "../forms/Profile";
import CredentialsForm from "../forms/Credentials";
import type { User } from "../context/auth.context";

type ProfileModalProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
};

export default function ProfileModal({
  open,
  user,
  onClose,
}: ProfileModalProps) {
  const [tab, setTab] = useState<"profile" | "credentials">(
    "profile"
  );

  if (!open || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1E1E1E] border border-white/10 rounded-lg w-[90%] max-w-lg p-6">

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab("profile")}
            className={`px-3 py-1 rounded text-sm ${
              tab === "profile" ? "bg-white/10 text-white" : "text-gray-400"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setTab("credentials")}
            className={`px-3 py-1 rounded text-sm ${
              tab === "credentials" ? "bg-white/10 text-white" : "text-gray-400"
            }`}
          >
            Credentials
          </button>
        </div>

        {/* Content */}
        {tab === "profile" && (
          <ProfileForm user={user} onClose={onClose} />
        )}

        {tab === "credentials" && (
          <CredentialsForm user={user} onClose={onClose} />
        )}

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-white/10 text-gray-300 rounded hover:bg-white/5"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}