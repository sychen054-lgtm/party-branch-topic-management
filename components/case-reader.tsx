"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjects } from "@/lib/hooks/use-data";
import { ArrowLeft, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";
import Link from "next/link";

interface CaseReaderProps {
  year: string;
}

export function CaseReader({ year }: CaseReaderProps) {
  const { data: projects = [] } = useProjects("concluded");
  const [currentSpread, setCurrentSpread] = useState(0);
  const [showToc, setShowToc] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  const yearProjects = projects.filter(
    (p) => p.status === "concluded" && new Date(p.createdAt).getFullYear().toString() === year
  );

  const totalPages = 2 + yearProjects.length;
  const totalSpreads = Math.ceil(totalPages / 2);

  const flip = (direction: number) => {
    const newSpread = currentSpread + direction;
    if (newSpread >= 0 && newSpread < totalSpreads && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(newSpread);
        setIsFlipping(false);
      }, 250);
    }
  };

  const goToProject = (index: number) => {
    const targetSpread = Math.floor((2 + index) / 2);
    if (targetSpread !== currentSpread) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(targetSpread);
        setIsFlipping(false);
      }, 250);
    }
  };

  const renderPage = (pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= totalPages) {
      return <div className="h-full bg-stone-50" />;
    }

    // Cover
    if (pageIndex === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-white p-8">
          <div className="w-12 h-px bg-white/30 mb-6" />
          <p className="text-4xl font-bold">{year}</p>
          <p className="text-xs text-white/50 mt-1 mb-6">年度</p>
          <p className="text-sm tracking-widest">案例集</p>
          <div className="w-12 h-px bg-white/30 mt-6" />
          <p className="text-xs text-white/40 mt-8">{yearProjects.length} 个课题</p>
        </div>
      );
    }

    // Table of Contents
    if (pageIndex === 1) {
      return (
        <div className="h-full p-6 bg-stone-50 flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-center tracking-widest text-stone-700">目 录</h2>
          <div className="space-y-1.5 flex-1 overflow-hidden">
            {yearProjects.slice(0, 14).map((project, index) => (
              <div
                key={project.id}
                className="flex items-center justify-between py-1 border-b border-dashed border-stone-300 cursor-pointer hover:bg-stone-100 px-2 rounded text-sm"
                onClick={() => goToProject(index)}
              >
                <span className="text-stone-600 line-clamp-1 flex-1">{project.title}</span>
                <span className="text-stone-400 ml-2 font-mono text-xs">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Project Content
    const project = yearProjects[pageIndex - 2];
    if (!project) return <div className="h-full bg-stone-50" />;

    return (
      <div className="h-full bg-stone-50 p-6 flex flex-col overflow-hidden">
        <div className="text-right text-xs text-stone-400 mb-2">{pageIndex - 1}</div>
        <div className="border-b border-stone-300 pb-2 mb-3">
          <h2 className="font-bold text-stone-800 line-clamp-2">{project.title}</h2>
          <p className="text-xs text-stone-500 mt-1">{project.organizationName} · {project.leader}</p>
        </div>
        <div className="flex-1 overflow-hidden space-y-3 text-sm text-stone-600">
          {project.summary && (
            <div>
              <h3 className="font-medium text-stone-700 mb-1">项目简介</h3>
              <p className="line-clamp-6 text-xs leading-relaxed">{project.summary}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const leftPage = currentSpread * 2;
  const rightPage = currentSpread * 2 + 1;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-8" asChild>
            <Link href="/cases">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
          <span className="text-sm font-medium">{year}年度案例集</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8" onClick={() => setShowToc(!showToc)}>
          {showToc ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* TOC */}
        {showToc && (
          <div className="w-48 shrink-0 bg-card rounded-lg border flex flex-col">
            <div className="p-3 border-b text-sm font-medium">目录</div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                <div
                  className={`px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                    currentSpread === 0 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => { setCurrentSpread(0); }}
                >
                  封面
                </div>
                {yearProjects.map((project, index) => {
                  const spread = Math.floor((2 + index) / 2);
                  return (
                    <div
                      key={project.id}
                      className={`px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                        currentSpread === spread ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => goToProject(index)}
                    >
                      <span className="line-clamp-1">{project.title}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Book */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div 
            className={`relative w-full max-w-5xl shadow-xl rounded transition-transform duration-250 ${
              isFlipping ? "scale-[0.98]" : ""
            }`}
            style={{ aspectRatio: "2/1.35", maxHeight: "calc(100vh - 240px)" }}
          >
            <div className="absolute inset-0 flex rounded overflow-hidden">
              {/* Left Page */}
              <div className="w-1/2 h-full border-r border-stone-200 relative">
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10" />
                {renderPage(leftPage)}
              </div>
              {/* Right Page */}
              <div className="w-1/2 h-full relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-10" />
                {renderPage(rightPage)}
              </div>
              {/* Spine */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-r from-black/10 via-black/5 to-black/10 z-20" />
            </div>

            {/* Click zones */}
            {currentSpread > 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-1/4 cursor-pointer z-30 group" onClick={() => flip(-1)}>
                <div className="h-full flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft className="h-6 w-6 text-stone-400" />
                </div>
              </div>
            )}
            {currentSpread < totalSpreads - 1 && (
              <div className="absolute right-0 top-0 bottom-0 w-1/4 cursor-pointer z-30 group" onClick={() => flip(1)}>
                <div className="h-full flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-6 w-6 text-stone-400" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-4">
            <Button variant="ghost" size="sm" onClick={() => flip(-1)} disabled={currentSpread === 0 || isFlipping}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-24 text-center">
              {leftPage + 1}-{Math.min(rightPage + 1, totalPages)} / {totalPages}
            </span>
            <Button variant="ghost" size="sm" onClick={() => flip(1)} disabled={currentSpread === totalSpreads - 1 || isFlipping}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
