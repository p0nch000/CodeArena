import { Select, SelectItem } from "@heroui/react";

export default function Dropdown({ 
  options = [], 
  label = "Select an Option", 
  value, 
  onChange,
  className = "max-w-xs" 
}) {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select 
        className={className} 
        label={label}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}