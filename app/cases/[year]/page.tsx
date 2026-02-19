import { CaseReader } from "@/components/case-reader";

interface CaseReaderPageProps {
  params: Promise<{
    year: string;
  }>;
}

export default async function CaseReaderPage({ params }: CaseReaderPageProps) {
  const { year } = await params;
  return <CaseReader year={year} />;
}
