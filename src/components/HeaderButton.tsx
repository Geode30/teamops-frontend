type HeaderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function HeaderButton({ children, className = "", ...props }: HeaderButtonProps) {
  return (
    <button
      className={`
        px-4 py-2 text-sm border rounded transition-colors duration-200 hover:bg-gray-100 hover:text-black
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}