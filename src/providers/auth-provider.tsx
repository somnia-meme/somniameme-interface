import { SignMessageModal } from "@/components/modals/sign-message-modal";
import useModalStore from "@/store/modal-store";
import { useUserStore } from "@/store/user-store";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const account = useAccount();
  const { addModal } = useModalStore();
  const userStore = useUserStore();

  function openSignMessageModal() {
    addModal({
      id: "sign-message-modal",
      children: <SignMessageModal />,
    });
  }

  async function handle() {
    const token = localStorage.getItem("token");

    if (account.status == "disconnected") {
      userStore.logout();
      return;
    }

    if (account.status == "connecting") {
      return;
    }

    if (!token && account.status == "connected") {
      userStore.logout();
      openSignMessageModal();
      return;
    }

    if (account.status == "connected" && token) {
      try {
        const user = await userStore.getUser();
        userStore.login(user as any);
      } catch (error) {
        console.log(error);
        userStore.logout();
        openSignMessageModal();
      }
      return;
    }
  }

  useEffect(() => {
    handle();
  }, [account.status]);

  return <>{children}</>;
};
