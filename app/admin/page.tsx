"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Visitor Statistics</CardTitle>
          <CardDescription>
            View information about who has visited your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            See detailed information about your visitors, including their
            location and visit time.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push("/admin/visitors")}
            className="w-full"
          >
            View Visitors
          </Button>
        </CardFooter>
      </Card>

      {/* You can add more admin cards here in the future */}
    </div>
  );
}
