type AlertVariant = "success" | "warning" | "error";

interface AlertProps {
  variant: AlertVariant;
  message: string;
}

const variantStyles: Record<AlertVariant, string> = {
  success: "bg-green-500/10 text-green-400 border-green-500/30",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  error: "bg-red-500/10 text-red-400 border-red-500/30",
};

const icons: Record<AlertVariant, React.ReactElement> = {
  success: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.516 11.59c.75 1.334-.213 2.99-1.742 2.99H3.483c-1.53 0-2.492-1.656-1.743-2.99l6.516-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-7a1 1 0 00-.993.883L9 8v3a1 1 0 001.993.117L11 11V8a1 1 0 00-1-1z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11h2v4H9V7zm0 6h2v2H9v-2z" />
    </svg>
  ),
};

export const Alert: React.FC<AlertProps> = ({ variant, message }) => {
  return (
    <div
      className={`flex items-center gap-3 border px-4 py-3 rounded-xl shadow-md ${variantStyles[variant]} bg-[#121212]`}
    >
      <div>{icons[variant]}</div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};