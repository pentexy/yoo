import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyToken(token) as any;
    return NextResponse.json({ user: { id: decoded.id, email: decoded.email } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
