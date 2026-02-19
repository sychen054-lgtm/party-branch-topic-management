"use client";

import React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Bell,
  FileText,
  Trophy,
  BookOpen,
  FolderKanban,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  GitBranch,
  Users,
  RefreshCw,
} from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: "工作台", href: "/", icon: LayoutDashboard },
  {
    name: "书记课题",
    icon: FileText,
    children: [
      { name: "通知公告", href: "/notices", icon: Bell },
      { name: "课题申报", href: "/projects/apply", icon: FileText },
      { name: "课题管理", href: "/projects", icon: FolderKanban },
      { name: "评选管理", href: "/selection", icon: Trophy },
      { name: "案例集", href: "/cases", icon: BookOpen },
    ],
  },
  {
    name: "党员发展",
    icon: Users,
    children: [
      { name: "流程模板", href: "/member-development/template", icon: GitBranch },
      { name: "流程详情", href: "/member-development/list", icon: FolderKanban },
    ],
  },
  {
    name: "支部换届",
    icon: RefreshCw,
    children: [
      { name: "流程模板", href: "/branch-election/template", icon: GitBranch },
      { name: "流程详情", href: "/branch-election/list", icon: FolderKanban },
    ],
  },
];

/**
 * 从 localStorage 读取侧栏折叠状态（仅客户端调用，避免 SSR/客户端不一致导致 hydration 报错）
 */
function readCollapsedFromStorage(): boolean {
  try {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored === "true";
  } catch {
    return false;
  }
}

export function AppSidebar() {
  const pathname = usePathname();
  /** 服务端与客户端首屏统一为 false，挂载后再从 localStorage 同步，避免 hydration mismatch */
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(readCollapsedFromStorage());
  }, []);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["书记课题", "党员发展", "支部换届"]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/projects") {
      return pathname.startsWith("/projects") && !pathname.startsWith("/projects/apply");
    }
    return pathname.startsWith(href);
  };

  const isParentActive = (children: NavItem[]) => {
    return children.some((child) => child.href && isActive(child.href));
  };

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col shrink-0 bg-sidebar border-r border-sidebar-border transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[4rem]" : "w-52 sm:w-56 md:w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center shrink-0", collapsed ? "justify-center px-0" : "gap-3 px-5")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
          <FileText className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground truncate">
            党建课题管理平台
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto sidebar-scrollbar", collapsed ? "px-2 py-4" : "px-3 py-4")}>
        <TooltipProvider delayDuration={300}>
          <ul className="space-y-1">
            {navigation.map((item) => {
              if (item.children) {
                const isExpanded = expandedMenus.includes(item.name);
                const hasActiveChild = isParentActive(item.children);

                const parentButton = (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "flex w-full items-center rounded-lg text-sm transition-all duration-200",
                      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                      hasActiveChild
                        ? "text-sidebar-foreground font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate text-left">{item.name}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                      </>
                    )}
                  </button>
                );

                return (
                  <li key={item.name}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{parentButton}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      parentButton
                    )}
                    {isExpanded && (
                      <ul className={cn("mt-1 space-y-1", collapsed ? "ml-0 border-l-0 pl-0" : "ml-4 border-l border-sidebar-border pl-3")}>
                        {item.children.map((child) => {
                          const childActive = child.href ? isActive(child.href) : false;
                          const childLink = (
                            <Link
                              href={child.href || "#"}
                              className={cn(
                                "flex items-center rounded-lg text-sm transition-all duration-200",
                                collapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
                                childActive
                                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                              )}
                            >
                              <child.icon className="h-4 w-4 shrink-0" />
                              {!collapsed && <span className="truncate">{child.name}</span>}
                            </Link>
                          );
                          return (
                            <li key={child.name}>
                              {collapsed ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>{childLink}</TooltipTrigger>
                                  <TooltipContent side="right" sideOffset={8}>
                                    {child.name}
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                childLink
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              const itemActive = item.href ? isActive(item.href) : false;
              const link = (
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center rounded-lg text-sm transition-all duration-200",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                    itemActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
              return (
                <li key={item.name}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>

      {/* User */}
      <div className={cn("shrink-0", collapsed ? "p-2" : "p-3")}>
        <div className={cn(
          "flex rounded-lg bg-sidebar-accent/60 transition-colors",
          collapsed ? "justify-center p-2" : "items-center gap-3 px-3 py-3"
        )}>
          {collapsed ? (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-8 w-8 shrink-0 cursor-default items-center justify-center rounded-full bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
                    管
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  管理员
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
                管
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">管理员</p>
                <p className="truncate text-xs text-sidebar-foreground/60">党建工作处</p>
              </div>
              <button className="p-1.5 rounded-md hover:bg-sidebar-border/50 transition-colors">
                <LogOut className="h-4 w-4 text-sidebar-foreground/60" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 折叠/展开箭头 */}
      <button
        type="button"
        onClick={toggleCollapsed}
        className="absolute top-1/2 -translate-y-1/2 -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  );
}
