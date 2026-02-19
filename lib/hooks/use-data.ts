import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Fetch failed");
  return json;
};

// Projects
export function useProjects(status?: string) {
  const url = status ? `/api/projects?status=${status}` : "/api/projects";
  return useSWR(url, fetcher);
}

export function useProject(id: string | null) {
  return useSWR(id ? `/api/projects/${id}` : null, fetcher);
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  // Revalidate all project-related caches
  mutate((key: string) => typeof key === "string" && key.startsWith("/api/projects"), undefined, { revalidate: true });
  mutate("/api/statistics", undefined, { revalidate: true });
  return result;
}

export async function createProject(data: Record<string, unknown>) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  mutate((key: string) => typeof key === "string" && key.startsWith("/api/projects"), undefined, { revalidate: true });
  mutate("/api/statistics", undefined, { revalidate: true });
  return result;
}

export async function deleteProject(id: string) {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  const result = await res.json();
  mutate((key: string) => typeof key === "string" && key.startsWith("/api/projects"), undefined, { revalidate: true });
  mutate("/api/statistics", undefined, { revalidate: true });
  return result;
}

// Organizations
export function useOrganizations() {
  return useSWR("/api/organizations", fetcher);
}

// Notices
export function useNotices() {
  return useSWR("/api/notices", fetcher);
}

// Statistics
export function useStatistics() {
  return useSWR("/api/statistics", fetcher);
}

// Member Developments
export function useMemberDevelopments() {
  return useSWR("/api/member-developments", fetcher);
}

// Branch Elections
export function useBranchElections() {
  return useSWR("/api/branch-elections", fetcher);
}
