import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Return early during build time to avoid env var access issues
  return NextResponse.json({
    success: false,
    error: "Diagnostic route disabled during build/deployment",
    buildTime: true,
    message: "This route is only available when running with full environment variables",
  })
}
