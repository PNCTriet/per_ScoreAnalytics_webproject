"use client";
import { Button } from "react-bootstrap";

export default function Home() {
  const send = async () => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "trietnguyenpham@gmail.com",
          name: "trietnguyenpham",
          subject: "Test Mail",
          body: "Check out this link: youtube.com/@@banhcuonniengrang",
        }),
      });

      const result = await response.json();
      console.log(result.message || result.error);
      console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
      console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <Button type="button" onClick={send}>
        Test
      </Button>
    </main>
  );
}
