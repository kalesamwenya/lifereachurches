import React from 'react';

export default function DropdownWrapper({ title, icon: Icon, children, isOpen, onClick }) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 relative"
      >
        <Icon size={22} />
        {title === "Notifications" && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-50 font-bold">{title}</div>
          <div className="max-h-80 overflow-y-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
