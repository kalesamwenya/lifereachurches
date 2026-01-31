"use client";
import "../globals.css";
import { useState } from "react";
import Sidebar from "@/components/member/layout/Sidebar";
import Header from "@/components/member/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import { PusherProvider } from "@/context/PusherContext";
import { ChatProvider } from "@/context/ChatContext";

export default function MemberLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Closes dropdowns when clicking anywhere else
  const closeAll = () => setActiveDropdown(null);

  const handleToggleDropdown = (e, name) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
     <AuthProvider>
       <PusherProvider>
         <ChatProvider>
            <div 
              className="flex flex-row-reverse h-screen overflow-hidden" 
              onClick={closeAll}
            >
              {/* SIDEBAR */}
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

              {/* CONTENT AREA */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <Header 
                  isSidebarOpen={sidebarOpen} 
                  onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                  activeDropdown={activeDropdown}
                  toggleDropdown={handleToggleDropdown}
                />

                <main className="flex-1 overflow-y-auto p-3 lg:p-10 bg-gray-50">
                  {children}
                </main>
              </div>
            </div>
          </ChatProvider>
        </PusherProvider>
      </AuthProvider>
  );
}