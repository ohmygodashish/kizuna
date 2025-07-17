import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Google APIs 統合診断開始 ===")

    // 環境変数チェック
    const envCheck = {
      GOOGLE_API_CREDENTIALS: !!process.env.GOOGLE_API_CREDENTIALS,
      GOOGLE_SHEETS_CREDENTIALS: !!process.env.GOOGLE_SHEETS_CREDENTIALS,
      GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID,
      GOOGLE_DRIVE_FOLDER_ID: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    }

    // Diagnostic route disabled during build to avoid authentication issues
    // This route only checks environment variables and doesn't test actual connections
    return NextResponse.json({
      success: true,
      message: "診断機能は本番環境では無効化されています",
      envCheck,
      note: "This diagnostic route is disabled during build to prevent authentication issues.",
    })
  } catch (error) {
    console.error("Error in diagnostic route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
