import React from 'react';

function SelectField({ label, name, options, className, onChange, value }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white/70 text-xs">{label}</label>
      <select 
        name={name}
        className={className}
        onChange={onChange}
        value={value || ""}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;