import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const INQUIRIES_FILE = path.join(process.cwd(), "data", "inquiries.json");
const RECIPIENT_EMAIL = "itsparkash21@gmail.com";
const CMS_PASSWORD = "parkash@1212";

// Ensure data directory and inquiries.json exist
function getInquiries(): any[] {
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      fs.writeFileSync(INQUIRIES_FILE, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(INQUIRIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading inquiries:", err);
    return [];
  }
}

function saveInquiries(inquiries: any[]) {
  try {
    const dir = path.dirname(INQUIRIES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving inquiries:", err);
  }
}

// POST: Save inquiry and forward to email via FormSubmit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, agency, service, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      agency: String(agency || "Not provided").trim(),
      service: String(service || "General Video Editing").trim(),
      budget: String(budget || "Discuss on Call").trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      status: "new",
    };

    // Save locally
    const inquiries = getInquiries();
    inquiries.unshift(newInquiry);
    saveInquiries(inquiries);

    // Forward to FormSubmit (itsparkash21@gmail.com)
    let emailSent = false;
    let emailMessage = "";
    try {
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "http://localhost:3000",
          Referer: "http://localhost:3000/",
        },
        body: JSON.stringify({
          _subject: `New Project Inquiry from ${newInquiry.name} [${newInquiry.budget}]`,
          _replyto: newInquiry.email,
          _template: "table",
          Name: newInquiry.name,
          Email: newInquiry.email,
          Service: newInquiry.service,
          Budget: newInquiry.budget,
          "Channel / Company": newInquiry.agency,
          "Project Details": newInquiry.message,
          "Submitted At": new Date().toLocaleString(),
        }),
      });

      const result = await formSubmitRes.json();
      if (result.success === "true" || result.success === true) {
        emailSent = true;
      } else {
        emailMessage = result.message || "";
      }
    } catch (err: any) {
      console.error("FormSubmit forwarding error:", err.message);
    }

    return NextResponse.json(
      {
        success: true,
        inquiry: newInquiry,
        emailSent,
        emailMessage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to process inquiry" }, { status: 500 });
  }
}

// GET: Retrieve inquiries (guarded by CMS password)
export async function GET(request: NextRequest) {
  const password = request.headers.get("x-cms-password");
  if (password !== CMS_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = getInquiries();
  return NextResponse.json(inquiries);
}

// DELETE: Delete an inquiry by id (guarded by CMS password)
export async function DELETE(request: NextRequest) {
  const password = request.headers.get("x-cms-password");
  if (password !== CMS_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Inquiry ID required" }, { status: 400 });
  }

  let inquiries = getInquiries();
  inquiries = inquiries.filter((inq) => inq.id !== id);
  saveInquiries(inquiries);

  return NextResponse.json({ success: true });
}
