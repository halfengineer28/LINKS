import React from "react";
const sizeClass = `loading-${size}`;
const LoadingSpinner = () => {
  return <span className={`loading loading-spinner ${sizeClass}`}></span>;
};

export default LoadingSpinner;
