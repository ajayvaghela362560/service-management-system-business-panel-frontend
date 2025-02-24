"use client";
import { redirect } from 'next/navigation';
import { useSaveTokenStore } from "@/store/login";

export default async function Dashboard() {
  const token = useSaveTokenStore((state) => state.token);

  if (!token) {
    return redirect('/business/sign-in');
  } else {
    redirect('/business/dashboard/overview');
  }
}
