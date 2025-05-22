import React from 'react';
export default function Dropdown({ 
  options = [], 
  label = "Select an Option", 
  value, 
  onChange,
}) {
  // Manejar el cambio para que siempre devuelva un string
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Función para capitalizar la primera letra
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-white">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-2 rounded-md text-white border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {capitalize(option)}
          </option>
        ))}
      </select>
    </div>
  );
}