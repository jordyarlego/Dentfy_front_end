interface InputTesteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
}

export default function InputTeste({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  ...rest
}: InputTesteProps) {
  const inputId =
    rest.id || (label ? label.toLowerCase().replace(/\s/g, "-") : undefined);

  return (
    <div className="w-full mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1 text-sm font-medium text-cyan-100"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border bg-[#F0F4F8] rounded-xl focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-[#01777B]"
        }`}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
