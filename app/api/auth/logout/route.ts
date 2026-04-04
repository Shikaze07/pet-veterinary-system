import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await logout();
    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
