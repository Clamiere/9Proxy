import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

function getSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export interface ExploreItem {
  id: number
  program_slug: string
  platform: "youtube" | "tiktok" | "x" | "reddit" | "blog"
  title: string
  url: string
  thumbnail: string | null
  author: string
  views: number
  likes: number
  snippet: string | null
  sift_score: number | null
  sift_tag: string | null
  published_at: string | null
  fetched_at: string
}

export interface ExploreFilters {
  platform?: string
  program?: string
  category?: string
  timeRange?: string
  sort?: string
  quality?: string
  q?: string
  page?: number
  pageSize?: number
}

export interface ExploreResult {
  items: ExploreItem[]
  total: number
  page: number
  pageSize: number
  platforms: { platform: string; count: number }[]
  programs: string[]
}

function getDateThreshold(timeRange: string): string | null {
  const now = new Date()
  switch (timeRange) {
    case "7d":
      return new Date(now.getTime() - 7 * 86400000).toISOString()
    case "30d":
      return new Date(now.getTime() - 30 * 86400000).toISOString()
    case "90d":
      return new Date(now.getTime() - 90 * 86400000).toISOString()
    default:
      return null
  }
}

export async function fetchExploreData(
  filters: ExploreFilters
): Promise<ExploreResult> {
  const supabase = getSupabase()
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 25
  const offset = (page - 1) * pageSize

  // Build query
  let query = supabase
    .from("social_items")
    .select("*", { count: "exact" })

  // Platform filter
  if (filters.platform && filters.platform !== "all") {
    query = query.eq("platform", filters.platform)
  }

  // Program filter
  if (filters.program) {
    query = query.eq("program_slug", filters.program)
  }

  // Time range filter
  const dateThreshold = getDateThreshold(filters.timeRange ?? "all")
  if (dateThreshold) {
    query = query.gte("published_at", dateThreshold)
  }

  // SIFT quality filter — only show scored content above threshold
  if (filters.quality && filters.quality !== "all") {
    const minScore = parseInt(filters.quality, 10)
    if (!isNaN(minScore)) {
      query = query.gte("sift_score", minScore)
    }
  }

  // Search
  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,author.ilike.%${filters.q}%,snippet.ilike.%${filters.q}%`
    )
  }

  // Sort
  switch (filters.sort) {
    case "likes":
      query = query.order("likes", { ascending: false, nullsFirst: false })
      break
    case "quality":
      query = query.order("sift_score", { ascending: false, nullsFirst: false })
      break
    case "recent":
      query = query.order("published_at", { ascending: false, nullsFirst: false })
      break
    case "views":
    default:
      query = query.order("views", { ascending: false, nullsFirst: false })
      break
  }

  // Pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, count, error } = await query

  if (error) {
    console.error("Explore query error:", error)
    return { items: [], total: 0, page, pageSize, platforms: [], programs: [] }
  }

  // Get unique programs for filter dropdown
  const { data: programSlugs } = await supabase
    .from("social_items")
    .select("program_slug")
    .limit(1000)

  const uniquePrograms = [
    ...new Set((programSlugs ?? []).map((r: { program_slug: string }) => r.program_slug)),
  ].sort() as string[]

  return {
    items: (data ?? []) as ExploreItem[],
    total: count ?? 0,
    page,
    pageSize,
    platforms: [],
    programs: uniquePrograms,
  }
}

export async function fetchPlatformCounts(): Promise<
  Record<string, number>
> {
  const supabase = getSupabase()
  const platforms = ["youtube", "tiktok", "x", "reddit", "blog"]
  const counts: Record<string, number> = {}

  await Promise.all(
    platforms.map(async (p) => {
      const { count } = await supabase
        .from("social_items")
        .select("id", { count: "exact", head: true })
        .eq("platform", p)
      counts[p] = count ?? 0
    })
  )

  return counts
}
