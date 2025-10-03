import { NextRequest, NextResponse } from "next/server";
import { encryptField } from "@/lib/crypto-utils"; 

export async function POST(request: NextRequest) {
  try {
    const { userName, text } = await request.json();
    
    if (!userName || !text) {
      return NextResponse.json(
        { error: "userName and text are required" },
        { status: 400 }
      );
    }
    
    const encryptedUserName = encryptField(userName);
    const encryptedText = encryptField(text);
    
    return NextResponse.json({ 
      encryptedUserName, 
      encryptedText 
    });
  } catch (error) {
    console.error("Encryption API error:", error);
    return NextResponse.json(
      { error: "Failed to encrypt message" },
      { status: 500 }
    );
  }
}