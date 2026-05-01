import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, url, auditResult } = body;

    // 1. Build the HTML template for the PDF (Same as your generator)
    const aiData = auditResult?.ai_analysis || {};
    const perfData = auditResult?.performance_data || {};
    const summary = aiData.audit_summary || {};
    const criticalFixes = aiData.critical_fixes_checklist || [];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>@page { size: A4 portrait; margin: 15mm; }</style>
      </head>
      <body class="text-gray-900 bg-[#fafafa]">
        <div class="bg-[#0A101D] rounded-2xl p-6 mb-6">
          <h1 class="text-2xl font-black text-white truncate">${url}</h1>
          <p class="text-gray-400 font-mono text-xs mt-2">KlarAI SEO Audit Report</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border mb-6">
          <h2 class="text-lg font-black mb-3">AI Executive Verdict</h2>
          <p class="text-xs text-gray-700 italic">${summary?.verdict || 'Analysis completed.'}</p>
        </div>
        ${criticalFixes.length > 0 ? `
          <div class="bg-white border p-6 rounded-2xl">
            <h3 class="text-base font-black text-red-500 mb-4">Critical Fixes Required</h3>
            <ul class="space-y-3">
              ${criticalFixes.map(fix => `<li class="text-sm border-b pb-2">• ${fix}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </body>
      </html>
    `;

    // 2. Generate the PDF Buffer using Puppeteer
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // 3. Connect to your Email Account using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Assuming you are using a Gmail/Google Workspace account
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // 4. Send the Email with the PDF attached
    await transporter.sendMail({
      from: `"KlarAI Audits" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Free SEO Audit Report for ${url}`,
      text: `Hi there,\n\nThank you for using the KlarAI SEO Auditor. Attached is your comprehensive intelligence report for ${url}.\n\nIf you need help fixing these issues, reply directly to this email to book a strategy call.\n\nBest,\nThe KlarAI Team`,
      attachments: [
        {
          filename: `KlarAI_Report.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Email Sending Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}