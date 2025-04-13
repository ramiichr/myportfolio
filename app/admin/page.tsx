"use client";

import { Suspense } from "react";
import VisitorDashboard from "@/components/admin/visitor-dashboard";

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisitorDashboard />
    </Suspense>
  );
}
