import { NextResponse } from "next/server";

export function successResponse(data, message = "Operation successful", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function errorResponse(message, errors = [], status = 400) {
  return NextResponse.json({ success: false, message, errors }, { status });
}
