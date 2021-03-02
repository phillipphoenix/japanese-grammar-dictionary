import React, { useState, useEffect, useContext, createContext } from "react";
import { firebase } from "../utils/firebaseClient";
import nookies from "nookies";

export interface AuthContextProps {
  user: firebase.User | null;
  /**
   * Call this to refresh current user data.
   * This is useful, when updating for instance display name or email or the like.
   */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  refreshUser: null,
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies;
    }
    return firebase.auth().onIdTokenChanged(async (user) => {
      console.log(`token changed!`);
      if (!user) {
        console.log(`no token found...`);
        setUser(null);

        nookies.destroy(null, "token");
        nookies.set(null, "token", "", { path: "/" });
        return;
      }

      console.log(`updating token...`);
      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: "/" });
    });
  }, []);

  const refreshUser = async () => {
    console.log(`refreshing token...`);
    const user = firebase.auth().currentUser;
    if (user) await user.getIdToken(true);
  };

  // Force refresh the token every 10 minutes.
  useEffect(() => {
    const handle = setInterval(refreshUser, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return <AuthContext.Provider value={{ user, refreshUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
