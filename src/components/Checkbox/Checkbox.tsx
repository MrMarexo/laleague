import React from "react";

const Checkbox: React.FC = () => {
  return (
    <div className="mb-2 mr-4 flex items-center">
      <input
        type="checkbox"
        id="A3-yes"
        name="A3-confirmation"
        value="yes"
        className="absolute h-5 w-10 opacity-0"
      />
      <div className="mr-2 flex h-5 w-10 flex-shrink-0 items-center justify-center  border-2 border-black bg-white focus-within:border-red-900">
        <svg
          className="pointer-events-none hidden h-3 w-3  fill-current"
          version="1.1"
          viewBox="0 0 17 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" fill-rule="evenodd">
            <g transform="translate(-9 -11)" fill="#168530" fill-rule="nonzero">
              <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Checkbox;
