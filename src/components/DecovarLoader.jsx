import React from 'react';

const DecovarLoader = ({ text = "LOADING", size = "sm", className = "" }) => {
  const sizeClass = size === "lg" ? "decovar-loader-lg" : "decovar-loader-sm";

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <span 
        className={`decovar-loader ${sizeClass}`} 
        data-text={text}
      >
        {text}
      </span>
    </div>
  );
};

export default DecovarLoader;
