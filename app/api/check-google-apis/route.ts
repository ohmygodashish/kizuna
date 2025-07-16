import { type NextRequest, NextResponse } from "next/server"
import { testGoogleApiConnection, getCredentialsInfo } from "@/lib/google-api-client"
import { getSpreadsheetInfo } from "@/lib/google-sheets"
import { testGoogleDriveConnection, getFolderInfo } from "@/lib/google-drive"

export async function GET(request: NextRequest) {
  // Return early during build time to avoid env var access issues
  return NextResponse.json({
    success: false,
    error: "Diagnostic route disabled during build/deployment",
    buildTime: true,
    message: "This route is only available when running with full environment variables"
  });
}

    // 基本的なGoogle API接続テスト
    const apiConnectionTest = await testGoogleApiConnection()

    // Google Sheets情報取得
    let sheetsInfo = null
    let sheetsError = null
    if (process.env.GOOGLE_SHEET_ID) {
      try {
        sheetsInfo = await getSpreadsheetInfo()
      } catch (error) {
        sheetsError = error instanceof Error ? error.message : "Unknown error"
      }
    }

    // Google Drive詳細テスト
    const driveTest = await testGoogleDriveConnection()

    // フォルダ情報取得
    let folderDetails = null
    if (process.env.GOOGLE_DRIVE_FOLDER_ID && driveTest.success) {
      try {
        folderDetails = await getFolderInfo(process.env.GOOGLE_DRIVE_FOLDER_ID)
      } catch (error) {
        console.error("Error getting folder details:", error)
      }
    }

    const overallSuccess = apiConnectionTest.success && driveTest.success && !sheetsError

    return NextResponse.json({
      success: overallSuccess,
      timestamp: new Date().toISOString(),
      environmentVariables: envCheck,
      credentialsInfo: {
        client_email: credentialsInfo.client_email,
        project_id: credentialsInfo.project_id,
        client_id: credentialsInfo.client_id,
      },
      apiConnectionTest,
      sheetsInfo,
      sheetsError,
      driveTest,
      folderDetails,
      recommendations: {
        useUnifiedCredentials: !envCheck.GOOGLE_API_CREDENTIALS && envCheck.GOOGLE_SHEETS_CREDENTIALS,
        apiOptimizations: [
          "統一された認証クライアントを使用",
          "APIクライアントのシングルトンパターン実装",
          "エラーハンドリングの改善",
          "Shared Drive完全対応",
        ],
      },
    })
  } catch (error) {
    console.error("Error in Google APIs diagnosis:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
