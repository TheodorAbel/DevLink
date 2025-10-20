"use client";

import { toast } from "sonner";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { ReactNode } from "react";

type Variant = "success" | "info" | "warning" | "error";

type ShowOptions = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

const variantStyles: Record<Variant, { ring: string; pill: string; Icon: any }> = {
  success: {
    ring: "from-emerald-500/20 to-green-600/20",
    pill: "from-emerald-500 to-green-600",
    Icon: CheckCircle2,
  },
  info: {
    ring: "from-blue-500/20 to-indigo-600/20",
    pill: "from-blue-500 to-indigo-600",
    Icon: Info,
  },
  warning: {
    ring: "from-amber-600/30 to-orange-700/30",
    pill: "from-amber-600 to-orange-600",
    Icon: AlertTriangle,
  },
  error: {
    ring: "from-rose-500/20 to-red-600/20",
    pill: "from-rose-500 to-red-600",
    Icon: XCircle,
  },
};

function GlassCard({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-sm w-full pointer-events-auto rounded-xl border shadow-xl backdrop-blur-xl bg-white/90 dark:bg-neutral-900/90 border-white/60 dark:border-neutral-800/80">
      {children}
    </div>
  );
}

function ExpensiveToast({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  tId,
}: {
  variant: Variant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  tId: string | number;
}) {
  const { pill, ring, Icon } = variantStyles[variant];
  return (
    <GlassCard>
      <div className="relative p-4">
        <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br ${ring} blur-2xl opacity-60`} />
        <div className="flex items-start gap-3">
          <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${pill} flex items-center justify-center text-white shadow`}> 
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-5 text-gray-900 dark:text-gray-100">{title}</p>
            {description && (
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-5">{description}</p>
            )}
            {actionLabel && (
              <button
                onClick={() => {
                  onAction?.();
                  toast.dismiss(tId);
                }}
                className="mt-2 text-xs font-medium text-foreground/90 hover:text-foreground underline decoration-dotted"
              >
                {actionLabel}
              </button>
            )}
          </div>
          <button
            aria-label="Dismiss"
            onClick={() => toast.dismiss(tId)}
            className="h-7 w-7 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

export function useExpensiveToast() {
  const show = (variant: Variant, opts: ShowOptions) => {
    const id = toast.custom((t) => (
      <ExpensiveToast
        variant={variant}
        title={opts.title}
        description={opts.description}
        actionLabel={opts.actionLabel}
        onAction={opts.onAction}
        tId={t}
      />
    ), {
      duration: opts.duration ?? 3500,
      className: "",
    });
    return id;
  };

  return {
    success: (opts: ShowOptions) => show("success", opts),
    info: (opts: ShowOptions) => show("info", opts),
    warning: (opts: ShowOptions) => show("warning", opts),
    error: (opts: ShowOptions) => show("error", opts),
  };
}
