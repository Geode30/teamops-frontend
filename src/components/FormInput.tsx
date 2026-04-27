export default function FormInput({
  type = "text",
  name,
  label,
  value,
  onChange,
  required = false,
}: {
  type?: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300" htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-[#1f1f1f] px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}