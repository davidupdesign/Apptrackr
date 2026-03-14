"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { useRouter } from "next/navigation";
import { setToken, setUser } from "../store/authSlice";
import api from "../lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // gives access to the redux store dispatch function
  const dispatch = useDispatch<AppDispatch>();
  // lets me navigate to other pages
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); //to not reload the browser on submit
    setError("");
    setLoading(true);

    try {
      // 1 - call PPOST /auth/login, get the token
      const { data } = await api.post("/auth/login", { email, password });

      // 2 - store the token in redux + localstorage
      dispatch(setToken(data.access_token));

      //3 - fetch user profile w/ the token
      const { data: user } = await api.get("/auth/me");

      //4 - store the user in redux
      dispatch(setUser(user));

      //5 - redirect to dashboard
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div></div>
  ) 
}
