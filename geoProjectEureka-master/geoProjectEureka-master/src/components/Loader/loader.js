import React from "react";

const Loader = ({ size = "medium" }) => {
    const sizeClasses = {
        small: { svg: "h-4 w-4", text: "text-sm" },
        medium: { svg: "h-6 w-6", text: "text-base" },
        large: { svg: "h-8 w-8", text: "text-lg" },
        xl: { svg: "h-10 w-10", text: "text-xl" }
    };
    const { svg, text } = sizeClasses[size] || sizeClasses["medium"];

    return (
        <div className="flex items-center justify-center">
            <svg
                className={`animate-spin ${svg}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <span className={`font-medium ${text} ml-3`}>Processing...</span>
        </div>
    );
}

export default Loader;
