import { createFileRoute, redirect } from "@tanstack/react-router";

// Preserves the old <Route path="/work" element={<Navigate to="/projects" replace />} />
export const Route = createFileRoute("/work")({
  beforeLoad: () => {
    throw redirect({ to: "/projects", replace: true });
  },
});
