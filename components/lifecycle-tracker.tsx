"use client";

import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/types";
import { Check, Circle, Clock } from "lucide-react";

const lifecycleStages = [
  { key: "申报", statuses: ["draft", "pending_county", "county_rejected", "pending_city", "city_rejected", "pending_province", "province_rejected"] },
  { key: "立项", statuses: ["approved"] },
  { key: "执行", statuses: ["in_progress"] },
  { key: "结题", statuses: ["pending_conclusion", "concluded"] },
  { key: "评选", statuses: ["city_selection", "city_selected", "province_selection", "province_selected"] },
  { key: "发布", statuses: ["典型案例", "published"] },
];

interface LifecycleTrackerProps {
  currentStatus: ProjectStatus;
  className?: string;
}

export function LifecycleTracker({ currentStatus, className }: LifecycleTrackerProps) {
  const getCurrentStageIndex = () => {
    for (let i = 0; i < lifecycleStages.length; i++) {
      if (lifecycleStages[i].statuses.includes(currentStatus)) {
        return i;
      }
    }
    return 0;
  };

  const currentStageIndex = getCurrentStageIndex();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {lifecycleStages.map((stage, index) => {
        const isPast = index < currentStageIndex;
        const isCurrent = index === currentStageIndex;
        const isFuture = index > currentStageIndex;

        return (
          <div key={stage.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isPast && "border-emerald-500 bg-emerald-500 text-white",
                  isCurrent && "border-primary bg-primary text-primary-foreground",
                  isFuture && "border-border bg-muted text-muted-foreground"
                )}
              >
                {isPast ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-xs font-medium",
                  isPast && "text-emerald-600",
                  isCurrent && "text-primary",
                  isFuture && "text-muted-foreground"
                )}
              >
                {stage.key}
              </span>
            </div>
            {index < lifecycleStages.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8",
                  index < currentStageIndex ? "bg-emerald-500" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
