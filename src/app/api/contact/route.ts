import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Simple validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all fields (name, email, message)." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Save to local messages.json for persistence
    const messagesFilePath = path.join(process.cwd(), "messages.json");
    
    let messages = [];
    if (fs.existsSync(messagesFilePath)) {
      try {
        const fileContent = fs.readFileSync(messagesFilePath, "utf-8");
        messages = JSON.parse(fileContent);
      } catch (err) {
        console.error("Failed to read messages.json, starting fresh", err);
      }
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");

    console.log("Contact form message saved successfully:", newMessage);

    return NextResponse.json(
      { success: true, message: "Thank you! Your message has been received successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in contact API route:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
