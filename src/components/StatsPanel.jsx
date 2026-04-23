import React from 'react';

const StatsPanel = () => {
  return (
    <div className="fixed top-4 left-4 z-40 bg-accent/90 border-2 border-white p-3 md:p-4 rounded shadow-lg">
      <div className="flex flex-col gap-2">
        <h1 className="text-gold text-xs md:text-sm border-b border-white/30 pb-1">
          Aiman Syafiq
        </h1>
        <div className="flex flex-col gap-1 text-[8px] md:text-[10px]">
          <div className="flex justify-between gap-4">
            <span className="text-text/70">CLASS:</span>
            <span className="text-text">Full-Stack Dev</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text/70">LVL:</span>
            <span className="text-text">2 YRS EXP</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text/70">HP:</span>
            <div className="w-16 h-2 md:h-3 bg-background border border-white mt-1">
              <div className="w-full h-full bg-green"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
