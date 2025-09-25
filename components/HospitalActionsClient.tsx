"use client";
import dynamic from "next/dynamic";

const HospitalActions = dynamic(() => import("@/components/hospital-actions"), { ssr: false });

export default function HospitalActionsClient(props: { address: string; name: string; phone: string }) {
  return <HospitalActions {...props} />;
}
