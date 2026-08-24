"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfile } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/utils/tokenStorage";
import { queryKeys } from "@/api/queryKeys";

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateIdentityStatus: (status: UserProfile["identity_status"]) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      return authService.getMe();
    },
    enabled: !!tokenStorage.getAccessToken(),
    retry: false,
  });

  const profile = data ?? null;

  const updateProfile = (updates: Partial<UserProfile>) => {
    queryClient.setQueryData<UserProfile>(queryKeys.profile, (prev) =>
      prev ? { ...prev, ...updates } : prev
    );
  };

  const updateIdentityStatus = (status: UserProfile["identity_status"]) => {
    updateProfile({ identity_status: status });
  };

  return (
    <UserProfileContext.Provider value={{ profile, isLoading, updateProfile, updateIdentityStatus }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}