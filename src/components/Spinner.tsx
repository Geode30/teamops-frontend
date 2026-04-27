import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse" />
      <div className="absolute inset-1 rounded-full border-2 border-t-cyan-400 border-white/10 animate-spin" />
    </div>
  );
};

export default Spinner;