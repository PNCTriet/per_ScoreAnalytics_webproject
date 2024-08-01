import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export async function POST(req: Request) {
  try {
    const { to, name, subject, body } = await req.json();

    // Đọc template HTML từ file
    const templatePath = path.resolve(process.cwd(), 'public', 'emailTemplate.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Thay thế các placeholder bằng dữ liệu thực
    template = template
      .replace('{{name}}', name)
      .replace('{{body}}', body)
      .replace('{{logo}}', 'logo.svg'); // Thay thế {{logo}} bằng đường dẫn đến logo SVG

    // Thiết lập cấu hình email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Tạo email
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: to,
      subject: subject,
      html: template, // Sử dụng HTML template
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
