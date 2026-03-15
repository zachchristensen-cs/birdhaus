import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "content.json");
const ADMIN_PASSWORD = "zach";

function checkAuth(request: Request) {
  return request.headers.get("x-admin-password") === ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const data = await fs.readFile(CONTENT_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  await fs.writeFile(CONTENT_PATH, JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}
