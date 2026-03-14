import { Suspense } from "react";
import { AcceptInviteForm } from "./AcceptInviteForm";

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center text-slate-500">Loading...</div>}>
      <AcceptInviteForm />
    </Suspense>
  );
}
