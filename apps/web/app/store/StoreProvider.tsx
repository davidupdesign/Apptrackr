"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { setUser } from "./authSlice";
import api from "@/app/lib/axios";

function AuthLoader() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = store.getState().auth.user;

    // only fetch if we have a token but no user loaded yet
    if (token && !currentUser) {
      api
        .get("/auth/me")
        .then(({ data }) => {
          store.dispatch(setUser(data));
        })
        .catch(() => {
          // token is invalid or expired — clean up
          localStorage.removeItem("token");
          document.cookie = "token=; path=/; max-age=0";
        });
    }
  }, []);

  return null; // this component renders nothing, just runs the effect
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* authloader runs the fetch, children render the ui */}
      <AuthLoader />
      {children}
    </Provider>
  );
}
