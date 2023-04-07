import React, { useState } from "react";

const Checkbox = React.forwardRef<HTMLInputElement, { isValue: boolean }>(
  ({ isValue, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(isValue);

    const handleChange = () => {
      setIsChecked((state) => !state);
    };

    return (
      <input
        type="checkbox"
        ref={ref}
        {...props}
        checked={isChecked}
        onChange={handleChange}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
