"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pill } from "lucide-react";

type MedicalStore = {
  id: string | number;
  name: string;
  [key: string]: any;
};

export default function MedicalStoreViewDetailsButton({ store }: { store: MedicalStore }) {
  const router = useRouter();
  return (
    <Button
      className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all flex items-center px-4 py-2 rounded text-white font-medium"
      onClick={() => {
        console.log("Navigating to store details:", store.id, store.name);
        router.push(`/medical-stores/${store.id}`);
      }}
    >
      <Pill className="h-4 w-4 mr-2" />
      View Details
    </Button>
  );
}
