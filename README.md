# AI Meeting Notes Summarizer – Project Documentation

## 1. Project Overview
__Purpose:__

This project is a __full-stack application__ that allows users to convert meeting transcripts into structured, editable summaries and share them via email. The app uses AI to generate summaries based on custom instructions provided by the user.

__Key Features:__

- Upload (.txt) or paste meeting transcripts.

- Enter custom instructions/prompts (e.g., summarize for executives, highlight action items).

- AI-generated summaries displayed in an editable textarea.

- Copy summary to clipboard.

- Send summary via email with improved HTML formatting (bold text, headings).

- Multiple email recipients supported.

## 2. Approach & Workflow
__Frontend (Next.js)__

- Built using __Next.js 13__ with the __App Router__.

- Components use React hooks (__```useState```__) for managing transcript, prompt, summary, email addresses, and loading states.

- Basic yet functional UI with:

    - Transcript textarea

    - Prompt input

    - Editable summary box

    - Buttons for generate, send, copy

    - Optional file upload for transcripts

- Toast notifications via __react-hot-toast__ for feedback.

  **User Flow:**
  
  1. User inputs transcript (paste or upload in .txt).
  
  2. User adds a custom instruction.
  
  3. Click “__Generate__” → calls backend __```/api/summarize```__.
  
  4. Summary is returned and displayed in an editable field.
  
  5. User can copy, or email the summary.

__Backend (API Routes)__

- __Built-in Next.js API Routes__ handle server-side logic.

- Two main endpoints:

**1. ```/api/summarize```**

 - Accepts __```transcript```__ and __```prompt```__.

 - Calls Groq API (model: __```llama-3.1-8b-instant```__) to generate a structured summary.

 - Returns __```summary```__ as JSON.

```javascript
const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: "You are a meeting summarizer." },
            { role: "user", content: `${prompt}\n\nTranscript:\n${transcript}` },
        ],
    }),
});
```


**2. ```/api/sendEmail```**

 - Accepts __```summary```__ and __```email```__ (supports multiple recipients).

 - Uses __SendGrid__ to send styled HTML email.

 - Converts bold syntax ** **text** into __```<strong>```__ and preserves lists.

 - Returns success/failure JSON message.

```javascript
await sgMail.send({
    to: emails,
    from: "vivashwanghosh@gmail.com",
    subject: "Your AI Meeting Summary",
    text: summary,
    html: htmlSummary, // formatted HTML version
});
```

## 3. Tech Stack

| Layer             | Technology / Tool                      |
|------------------|---------------------------------------|
| Frontend          | Next.js 13 (App Router), React, React Hooks |
| Backend           | Next.js API Routes, Node.js            |
| AI Model          | Groq API – __```llama-3.1-8b-instant```__       |
| Email Service     | SendGrid (single sender setup)         |
| Notifications     | react-hot-toast                         |
| Deployment        | Vercel   |


## 4. Enhancements & Features

 - Multiple recipients: Comma-separated emails supported.

 - Copy to clipboard: One-click copy of summary.

 - Styled email: HTML email with headings, bold text.

 - Editable summary: Users can adjust AI output before sharing.

 - File upload support: Users can upload __```.txt```__ transcripts instead of pasting.

## 5. Deployment Instructions

 1. Push project to GitHub repository.

 2. Create a Vercel account.

 3. Import GitHub repo into Vercel.

 4. Add environment variables in Vercel:

     - __```SENDGRID_API_KEY```__

     - __```GROQ_API_KEY```__

 5. Deploy project → Vercel provides live URL.

 6. Test features: generate summary, send email, copy.

## 6. Limitations

 - __AI API quota:__ Free Groq API has usage limits; large transcripts may fail.

 - __Email deliverability:__ Single sender setup may cause emails to land in spam. Full domain authentication requires paid plan.

 - __File uploads:__ Only __```.txt```__ supported for now; no PDFs or DOCX.

 - __No advanced styling on frontend:__ Focused on functionality over design.

## 7. Future Enhancements

 - Integrate __multi-format file uploads__ (PDF, DOCX).

 - Add __user authentication__ for saving summaries.

 - Enable __rich text editing__ for summary.

 - Support __custom AI models__ selection per user.

 - Improve __email deliverability__ via domain authentication.

## 8. Project Summary

This project demonstrates a __full-stack AI-powered tool__ for meeting productivity. It leverages:

 - Modern React + Next.js for frontend and API handling.

 - Groq API for free AI summary generation.

 - SendGrid for email sharing with HTML formatting.

 - File operations (upload) and clipboard integration for smooth UX.

The project is __deployed on Vercel__ and can be accessed via a live link, providing a fully functional demo without paid API requirements.

## Live Link to hosted project

Run the development server:

```
https://ai-meeting-notes-summarizer-beta.vercel.app/
```
