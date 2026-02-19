"use client";

import React from "react"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/lib/hooks/use-data";
import { Search, Download, BookOpen } from "lucide-react";
import Link from "next/link";

export function CaseLibrary() {
  const { data: projects = [] } = useProjects("concluded");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");

  const concludedProjects = projects.filter((p) => p.status === "concluded");
  
  const projectsByYear = concludedProjects.reduce((acc, project) => {
    const year = new Date(project.createdAt).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  const years = Object.keys(projectsByYear).sort((a, b) => Number(b) - Number(a));

  const filteredYears = years.filter((year) => {
    if (yearFilter !== "all" && year !== yearFilter) return false;
    if (searchTerm) {
      const hasMatchingProject = projectsByYear[year].some((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!hasMatchingProject) return false;
    }
    return true;
  });

  const handleDownload = (year: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    alert(`正在下载 ${year} 年度案例集...`);
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <Card className="border-0 shadow-sm">
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索课题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="年份" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}年</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredYears.map((year) => {
          const yearProjects = projectsByYear[year];
          return (
            <div key={year} className="group">
              {/* Book Cover */}
              <Link href={`/cases/${year}`}>
                <div 
                  className="relative aspect-[3/4] rounded-sm shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5 cursor-pointer overflow-hidden bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700"
                >
                  {/* Spine */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                    <div className="w-8 h-px bg-white/40 mb-4" />
                    <p className="text-2xl font-bold">{year}</p>
                    <p className="text-[10px] text-white/60 mt-1 mb-3">年度</p>
                    <p className="text-xs font-medium tracking-wider">案例集</p>
                    <div className="w-8 h-px bg-white/40 mt-4" />
                    <p className="text-[10px] text-white/50 mt-4">{yearProjects.length} 个课题</p>
                  </div>

                  {/* Page Edge */}
                  <div className="absolute right-0 top-1 bottom-1 w-0.5 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200" />
                </div>
              </Link>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" asChild>
                  <Link href={`/cases/${year}`}>
                    <BookOpen className="h-3 w-3 mr-1" />
                    阅读
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => handleDownload(year, e)}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredYears.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">暂无案例集</p>
        </div>
      )}
    </div>
  );
}
