import React from 'react';

export default function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <button
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
        active
          ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
          : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm uppercase tracking-wide">{label}</span>
    </button>
  );
}
