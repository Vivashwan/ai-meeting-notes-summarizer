import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function convertMarkdownBoldToHTML(text) {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

export async function POST(req) {
    const { emails, summary, prompt } = await req.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return new Response(JSON.stringify({ error: "No recipient emails provided" }), { status: 400 });
    }

    if (!summary || !summary.trim()) {
        return new Response(JSON.stringify({ error: "Summary is empty" }), { status: 400 });
    }

    try {
        const htmlSummary = convertMarkdownBoldToHTML(summary).replace(/\n/g, "<br>");

        await sgMail.send({
            to: emails,
            from: "vivashwanghosh@gmail.com",
            subject: "Your AI Meeting Summary",
            text: summary, // fallback for non-HTML clients
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="color: #0070f3;">AI Meeting Summary</h2>
          ${prompt ? `<p><strong>Instruction:</strong> ${prompt}</p>` : ""}
          <div style="border-top: 2px solid #0070f3; margin: 10px 0;"></div>
          <p>${htmlSummary}</p>
          <div style="border-top: 1px solid #ccc; margin-top: 20px; padding-top: 10px; color: #555; font-size: 12px;">
            Sent via AI Meeting Notes Summarizer
          </div>
        </div>
      `,
        });

        return new Response(JSON.stringify({ message: "Email sent successfully!" }), { status: 200 });
    } catch (error) {
        console.error("SendGrid error:", error);
        const errMsg = error.response?.body?.errors?.[0]?.message || error.message;
        return new Response(JSON.stringify({ error: errMsg }), { status: 500 });
    }
}
