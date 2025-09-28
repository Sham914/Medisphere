import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function EmailConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="flex flex-col items-center">
          <CheckCircle className="h-12 w-12 text-green-600 mb-2" />
          <CardTitle className="text-2xl font-bold text-center">Email Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700">Your email has been successfully verified. You can now continue using Medisphere.</p>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
