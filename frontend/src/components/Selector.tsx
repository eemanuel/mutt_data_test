import React from "react";

interface SelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: T[];
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: SelectProps<T>) {
  return (
    <div className="selector-div">
      <label className="selector-label">{label}</label>
      <select
        className="selector-select"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
