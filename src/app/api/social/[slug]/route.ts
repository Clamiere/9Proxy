import { NextRequest, NextResponse } from "next/server"
import { fetchSocialItems } from "@/lib/social"

export { type SocialItem } from "@/lib/social"

export const maxDuration = 55

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000",
  "CDN-Cache-Control": "public, s-maxage=604800",
  "Vercel-CDN-Cache-Control": "public, s-maxage=604800",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const items = await fetchSocialItems(slug)

  return NextResponse.json(
    { items, cached_at: new Date().toISOString() },
    { headers: CACHE_HEADERS }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CACHE_HEADERS })
}
