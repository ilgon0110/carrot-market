import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>("/api/users/me");
  const router = useRouter();
  const isPublic = router.pathname === "/enter" ? true : false;
  useEffect(() => {
    if (data && data.profile === null && !isPublic) {
      router.replace("/enter");
      // } else if (data && data.profile !== null && isPublic) {
      //   router.replace("/");
    } else if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router, isPublic]);

  return { user: data?.profile, isLoading: !data && !error };
}
