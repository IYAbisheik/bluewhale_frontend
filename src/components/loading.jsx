import React from "react";

const Loading = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}) => {
  const spinnerSizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "fixed inset-0 bg-white/70 z-50" : "py-6"
      }`}
    >
      <div
        className={`
          animate-spin rounded-full
          border-gray-300 border-t-blue-600
          ${spinnerSizes[size]}
        `}
      />

      {text && (
        <p className="text-sm font-medium text-gray-600">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;