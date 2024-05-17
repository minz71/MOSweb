"use client";
import React from "react";
const Complete: React.FC = () => {
  return (
    <div className="sm:w-full md:w-full lg:w-9/12 xl:w-8/12">
      <div className="min-h-96 bg-gradient-to-l from-slate-300 to-slate-100 text-slate-600 border border-slate-300 p-4 gap-10 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4 place-content-center h-48">
          <p className="text-2xl rounded-md text-center">
            感謝您參與本次實驗！
          </p>
        </div>
      </div>
    </div>
  );
};

export default Complete;
