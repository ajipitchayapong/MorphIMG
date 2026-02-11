import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { Sender_Email, Feedback_Contents } = await req.json();

    if (!Feedback_Contents) {
      return NextResponse.json(
        { error: "Feedback content is required" },
        { status: 400 },
      );
    }

    const data = await resend.emails.send({
      from: "MorphIMG Feedback <onboarding@resend.dev>",
      to: "saelim.aji@gmail.com",
      subject: "🚀 New Premium Feedback: MorphIMG",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #334155; border-radius: 20px; background-color: #0f172a; color: #f1f5f9;">
          <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; border-radius: 16px 16px 4px 4px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em;">New Feedback</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">MorphIMG Security System</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="margin-bottom: 30px;">
              <h3 style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; font-weight: 700;">Sender Information</h3>
              <div style="font-size: 15px; margin: 0; padding: 16px; background: #1e293b; border: 1px solid #334155; border-radius: 12px; color: #e2e8f0;">
                <span style="color: #3b82f6;">●</span> ${Sender_Email || "Anonymous User"}
              </div>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; font-weight: 700;">Feedback Content</h3>
              <div style="font-size: 16px; line-height: 1.7; margin: 0; padding: 20px; border-left: 4px solid #3b82f6; background: rgba(37, 99, 235, 0.1); border-radius: 0 12px 12px 0; color: #f1f5f9; border-top: 1px solid #334155; border-right: 1px solid #334155; border-bottom: 1px solid #334155;">
                ${Feedback_Contents.replace(/\n/g, "<br/>")}
              </div>
            </div>
            
            <div style="text-align: center; padding-top: 25px; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b;">
              <p style="margin: 0 0 5px 0;">This is an automated message from your security dashboard.</p>
              <p style="margin: 0;">© 2026 <strong>MorphIMG</strong> • Privacy Focused</p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
