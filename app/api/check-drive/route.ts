import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Build time safety: 環境変数にアクセスせずに早期リターン
  return NextResponse.json({
    success: false,
    error: "ビルド/デプロイ中は診断ルートが無効です",
    buildTime: true,
    message: "完全な環境変数で実行されているときのみ、このルートは利用可能です",
  })
}
