import { NextRequest, NextResponse } from "next/server";
import { decryptField } from "@/lib/crypto-utils"; 


export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    // The rest of the logic remains the same
    const decryptedMessages = messages.map((msg: any) => ({
      ...msg,
      user_name: decryptField(msg.user_name),
      text: decryptField(msg.text),
      // 🔑 Decrypt the image field from users table join
      users: msg.users ? {
        ...msg.users,
        image: msg.users.image ? decryptField(msg.users.image) : null,
      } : null,
    }));
    
    return NextResponse.json({ decryptedMessages });
  } catch (error) {
    console.error("Decryption API error:", error);
    return NextResponse.json(
      { error: "Failed to decrypt messages" },
      { status: 500 }
    );
  }
}