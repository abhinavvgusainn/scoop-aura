"use client";

import { useEffect } from "react";

import { client } from "@/lib/appwrite";

export default function AppwritePing() {
  useEffect(() => {
    void client.ping().catch((error) => {
      console.error("Appwrite ping failed", error);
    });
  }, []);

  return null;
}


