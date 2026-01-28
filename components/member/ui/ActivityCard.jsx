import React from 'react';

export default function ActivityCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorClass}`}>
        <Icon size={24} />
      </div>
      <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</h4>
      <div className="text-2xl font-black text-gray-900 mt-1">{value}</div>
      <p className="text-gray-500 text-xs mt-1 italic">{subtitle}</p>
    </div>
  );
}
