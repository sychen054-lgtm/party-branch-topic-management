"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/hooks/use-data";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  Share2,
  Download,
  Tag,
  Bookmark,
  Printer,
} from "lucide-react";
import Link from "next/link";

interface CaseDetailProps {
  caseId: string;
}

export function CaseDetail({ caseId }: CaseDetailProps) {
  const { data: projects = [] } = useProjects("concluded");
  const caseItem = projects.find((c: { id: string }) => c.id === caseId);

  if (!caseItem) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">案例不存在</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/cases">返回案例集</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2 -ml-2">
        <Link href="/cases">
          <ArrowLeft className="h-4 w-4" />
          返回案例集
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <div>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                  {caseItem.year}年度典型案例
                </span>
                <CardTitle className="text-2xl leading-relaxed">
                  {caseItem.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(caseItem.publishedAt).toLocaleDateString("zh-CN")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {caseItem.viewCount} 浏览
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {caseItem.likeCount} 点赞
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary */}
              <div className="mb-6 p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                <p className="text-sm leading-relaxed text-foreground">
                  {caseItem.summary}
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-sm max-w-none">
                {caseItem.content.split("\n").map((paragraph, index) => {
                  // Check if it's a heading
                  if (paragraph.match(/^[一二三四五六七八九十]+、/)) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-foreground mt-6 mb-3">
                        {paragraph}
                      </h3>
                    );
                  }
                  // Check if it's a sub-heading
                  if (paragraph.match(/^（[一二三四五六七八九十]+）/)) {
                    return (
                      <h4 key={index} className="text-base font-medium text-foreground mt-4 mb-2">
                        {paragraph}
                      </h4>
                    );
                  }
                  // Check if it's a numbered list item
                  if (paragraph.match(/^\d+\./)) {
                    return (
                      <p key={index} className="text-sm text-foreground leading-relaxed ml-4 mb-2">
                        {paragraph}
                      </p>
                    );
                  }
                  // Regular paragraph
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-sm text-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button className="w-full gap-2">
                <Heart className="h-4 w-4" />
                点赞 ({caseItem.likeCount})
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">案例亮点</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {caseItem.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-lg bg-primary/5"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                标签
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {caseItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Download */}
          {caseItem.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">相关材料</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {caseItem.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <span className="text-sm truncate">{attachment.name}</span>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
