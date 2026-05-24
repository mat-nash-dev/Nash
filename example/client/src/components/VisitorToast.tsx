import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { nanoid } from "nanoid";

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function VisitorToast() {
  const tracked = useRef(false);
  const trackMutation = trpc.visitors.track.useMutation();

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // Get or create session ID
    let sessionId = sessionStorage.getItem("nash_session_id");
    if (!sessionId) {
      sessionId = nanoid();
      sessionStorage.setItem("nash_session_id", sessionId);

      // Only show toast for brand-new sessions
      trackMutation.mutate(
        { sessionId, page: window.location.pathname },
        {
          onSuccess: (data) => {
            const n = data.visitNumber;
            setTimeout(() => {
              toast.success(`You are the ${getOrdinal(n)} person to view my website!`, {
                description: "Welcome to Nash's portfolio 🎉",
                duration: 6000,
                position: "bottom-center",
                style: {
                  background: "oklch(0.12 0.018 265)",
                  border: "1px solid oklch(0.65 0.22 290 / 0.4)",
                  color: "oklch(0.96 0.005 265)",
                },
              });
            }, 1500);
          },
        }
      );
    }
  }, []);

  return null;
}
