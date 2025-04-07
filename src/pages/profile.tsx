import { ProfilePage } from "@/components/view/profile";
import { useState, useEffect } from "react";
export default function Profile() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <ProfilePage />;
}
