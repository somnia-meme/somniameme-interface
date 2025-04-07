import { memo } from "react";
import { Navbar } from "./navbar";
import { ModalProvider } from "@/providers/modal-provider";
import { Footer } from "./footer";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppKitProvider } from "@/providers/appkit-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { NavbarTransactions } from "./navbar-transactions";

export const DefaultLayout = memo(() => {
  return (
    <AppKitProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <NavbarTransactions />
          <Navbar />
          <main className="flex-grow mt-8">
            <Outlet />
          </main>
          <Footer />
          <ModalProvider />
          <ToastContainer theme="dark" position="top-center" />
        </div>
      </AuthProvider>
    </AppKitProvider>
  );
});
