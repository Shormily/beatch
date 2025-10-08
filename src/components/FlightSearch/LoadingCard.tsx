import React from "react";

const LoadingCard = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="w-24 h-8 bg-slate-100 rounded-md"></div>
        <div className="w-24 h-8 bg-slate-100 rounded-md"></div>
      </div>
      <div className="animate-pulse space-y-4">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>

            {/* Text lines */}
            <div className="space-y-1">
              <div className="w-20 h-2 bg-slate-300 rounded"></div>
              <div className="w-28 h-2 bg-slate-200 rounded"></div>
              <div className="w-16 h-2 bg-slate-300 rounded"></div>
            </div>
          </div>

          <div>
            <div className="space-y-1">
              <div className="w-20 h-2 bg-slate-300 rounded"></div>
              <div className="w-28 h-2 bg-slate-200 rounded"></div>
              <div className="w-16 h-2 bg-slate-300 rounded"></div>
            </div>
          </div>
          {/* Right Card */}
          <div className="w-50 p-5 bg-slate-200 rounded-lg flex flex-col h-full justify-center items-center space-y-2 ">
            <div className="w-16 h-2 bg-slate-200 rounded"></div>
            <div className="w-20 h-2 bg-slate-300 rounded"></div>
            <div className="w-24 h-2 bg-slate-200 rounded"></div>
            <div className="flex gap-2">
              <div className="w-20 h-10 bg-slate-300 rounded-full mt-4 text-white flex items-center justify-center"></div>
              <div className="w-20 h-10 bg-slate-300 rounded-full mt-4 text-white flex items-center justify-center"></div>
            </div>
          </div>
        </div>

        <hr className="border-dashed border-slate-100" />

        {/* Bottom Row */}
        <div className="flex flex-wrap gap-3">
          <div className="w-24 h-8 bg-slate-100 rounded-md"></div>
          <div className="w-24 h-8 bg-slate-100 rounded-md"></div>
          <div className="w-24 h-8 bg-slate-100 rounded-md"></div>
          <div className="w-32 h-8 bg-slate-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
