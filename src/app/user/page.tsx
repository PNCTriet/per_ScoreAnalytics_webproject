'use client'
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function Home() {
  const [to, setTo] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const send = async () => {
    setStatus(null); // Reset status
    try {
      const response = await fetch('/api/sendEmail', { // Đảm bảo đường dẫn khớp với tên tệp API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          name,
          subject,
          body,
        }),
      });

      const result = await response.json();
      setStatus(result.message || result.error);
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('Error sending email');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <Form>
        <Form.Group controlId="formTo">
          <Form.Label>To</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Recipient email" 
            value={to} 
            onChange={(e) => setTo(e.target.value)} 
          />
        </Form.Group>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </Form.Group>
        <Form.Group controlId="formSubject">
          <Form.Label>Subject</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Subject of the email" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
          />
        </Form.Group>
        <Form.Group controlId="formBody">
          <Form.Label>Body</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            placeholder="Email body" 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
          />
        </Form.Group>
        <Button className='my-3' variant="primary" type="button" onClick={send}>
          Send
        </Button>
      </Form>
      {status && <p>{status}</p>}
    </main>
  );
}
