import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { vi } from "@/locales/vi";

export function BoatNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {vi.boat.notFound}
          </CardTitle>
          <CardDescription>
            {vi.boat.notFoundDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" variant="outline">
            <Link href="/">{vi.common.back}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
