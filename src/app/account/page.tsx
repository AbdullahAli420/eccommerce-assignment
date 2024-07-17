"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
// import { api } from "~/trpc/server"
import { api } from "~/trpc/react";
import Signup from "./signup";
import Verify from "./verify";
import Login from "./login";

export default function () {
  const [form, setForm] = useState(2);
  const [email, setEmail] = useState("");
  return (
    <div>
      {form === 0 && (
        <Signup email={email} setEmail={setEmail} setForm={setForm} />
      )}
      {form === 1 && (
        <Verify email={email} setEmail={setEmail} setForm={setForm} />
      )}
      {form === 2 && (
        <Login email={email} setEmail={setEmail} setForm={setForm} />
      )}
    </div>
  );
}
