"use client";
// import Page from "./account/page";
// import Categories from "./categories/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    if (token) {
      router.push("/categories");
    } else {
      router.push("/account");
    }
  });
  return <></>;
}
