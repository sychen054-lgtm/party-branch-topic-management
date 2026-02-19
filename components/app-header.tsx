"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="flex h-12 sm:h-14 items-center justify-between gap-2 border-b border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6">
      <div className="min-w-0">
        {title && (
          <h1 className="text-sm font-semibold text-foreground truncate sm:text-base">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="relative w-full max-w-[8rem] sm:max-w-[10rem] md:max-w-[14rem]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索..."
            className="w-full h-8 pl-8 text-sm bg-muted/50 border-0 focus-visible:ring-1 sm:h-9 sm:pl-9"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive" />
        </Button>
      </div>
    </header>
  );
}
