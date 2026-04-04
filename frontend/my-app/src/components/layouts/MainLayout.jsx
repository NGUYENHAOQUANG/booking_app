import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";

const MainLayout = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 selection:text-teal-700">
      {/* Header component */}
      <Header onOpenPasswordModal={() => setIsPasswordModalOpen(true)} />

      {/* Modal Change Password */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="pt-24 pb-20">
        <Outlet />
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default MainLayout;
