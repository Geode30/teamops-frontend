export default function PrimaryButton({
    children,
    type = "button",
    onClick,
}: {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-[0.99] transition font-medium"
        >
            {children}
        </button>
    );
}