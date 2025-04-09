interface InputTesteProps {
    label?: string;
    type?: string;
    placeholder?: string;
  }
  
  export default function InputTeste({ label, type = "text", placeholder = "" }: InputTesteProps) {
    return (
      <div className="w-full mb-4">
        {label && <label className="block mb-1 text-sm font-medium text-cyan-100">{label}</label>}
        <input
          type={type}
          placeholder={placeholder}
          className="w-full px-4 py-2 border bg-[#F0F4F8] border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01777B]"
        />
      </div>
    );
  }
  