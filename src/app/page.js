"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      toast.error("Only .txt files are supported for now");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setTranscript(event.target.result);
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!summary.trim()) return toast.error("Nothing to copy");
    navigator.clipboard.writeText(summary);
    toast.success("Summary copied to clipboard!");
  };

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      return toast.error("Transcript cannot be empty");
    }
    if (!prompt.trim()) {
      return toast.error("Please enter a summarization instruction");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await res.json();
      if (!data.summary) {
        throw new Error("No summary returned from server");
      }

      setSummary(data.summary);
    } catch (err) {
      toast.error(err.message || "Unexpected error during summarization");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      return toast.error("Recipient email cannot be empty");
    }
    if (!summary.trim()) {
      return toast.error("Summary is empty, generate it first");
    }

    const recipients = email
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (recipients.length === 0) {
      return toast.error("Please provide at least one valid email");
    }

    try {
      setSending(true);
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: recipients, summary }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast.success("Email sent successfully!");
    } catch (err) {
      toast.error(err.message || "Unexpected error while sending email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        background: "black",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        AI Meeting Notes Summarizer
      </h2>

      <textarea
        rows="6"
        placeholder="Paste transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid white",
          borderRadius: "5px",
          background: "#111",
          color: "white",
        }}
      />

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="file-upload"
          style={{
            display: "inline-block",
            padding: "8px 14px",
            background: "#2563eb",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📄 Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        {transcript && (
          <span style={{ marginLeft: "10px", color: "#bbb" }}>
            {transcript.length > 40
              ? transcript.slice(0, 40) + "..."
              : transcript.length + " chars uploaded"}
          </span>
        )}
      </div>

      <input
        type="text"
        placeholder="Enter custom instruction (e.g. summarize for executives)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid white",
          borderRadius: "5px",
          background: "#111",
          color: "white",
        }}
      />

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}
      >
        <button
          onClick={handleSummarize}
          disabled={loading}
          style={{
            padding: "8px 14px",
            background: loading ? "#374151" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  border: "2px solid white",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                }}
              ></span>
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h3 style={{ margin: 0 }}>Summary (editable):</h3>
        <button
          onClick={handleCopy}
          style={{
            padding: "6px 10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          title="Copy summary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M10 1.5H2a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h1v1a1 1 0 0 0 1 1h6.5a.5.5 0 0 0 .5-.5v-1H11a1 1 0 0 0-1-1V2a.5.5 0 0 0-.5-.5zM11 12v1H4v-1h7zM11 1v10H4V1h7z" />
          </svg>
        </button>
      </div>
      <textarea
        rows="8"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid white",
          borderRadius: "5px",
          background: "#111",
          color: "white",
        }}
      />

      <input
        type="text"
        placeholder="Recipient emails (comma separated)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid white",
          borderRadius: "5px",
          background: "#111",
          color: "white",
        }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSendEmail}
          disabled={sending}
          style={{
            padding: "8px 14px",
            background: sending ? "#065f46" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: sending ? "not-allowed" : "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {sending ? (
            <>
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  border: "2px solid white",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                }}
              ></span>
              Sending...
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>

      <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
    </div>
  );
}
