import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useUserId() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch("/api/user-id")
      .then((res) => res.json())
      .then((data) => setUserId(data.userId));
  }, [session]);

  return userId;
}
