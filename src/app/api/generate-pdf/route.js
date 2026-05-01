import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, auditResult } = body;

    // 1. Extract the data safely
    const aiData = auditResult?.ai_analysis || {};
    const perfData = auditResult?.performance_data || {};
    const summary = aiData.audit_summary || {};
    const criticalFixes = aiData.critical_fixes_checklist || [];
    const quickWins = aiData.quick_wins || [];
    const localOps = aiData.local_uk_opportunities || [];

    // 2. Build the HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { 
            font-family: 'Inter', system-ui, sans-serif; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
            background-color: #fafafa;
          }
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
        </style>
      </head>
      <body class="text-gray-900">
        
        <!-- Header -->
        <div class="bg-[#0A101D] rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#008dd8] to-[#00b4d8]"></div>
          <span class="inline-block py-1 px-3 rounded-full bg-gray-800 border border-gray-700 text-[#00b4d8] text-[8px] font-black tracking-[0.2em] uppercase mb-2">
            Intelligence Report
          </span>
          <h1 class="text-2xl font-black tracking-tight text-white truncate">${url || 'Website Audit'}</h1>
          <p class="text-gray-400 font-mono text-xs mt-2">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- High Level Scores -->
        <div class="grid grid-cols-2 gap-4 mb-6 avoid-break">
          <div class="bg-white p-5 rounded-2xl border border-gray-200">
            <h3 class="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1">Performance</h3>
            <div class="text-4xl font-black text-[#0A101D] leading-none mb-1">${perfData?.score || 'N/A'}</div>
            <p class="text-[9px] text-gray-500 font-medium">Core Web Vitals</p>
          </div>
          <div class="bg-[#0A101D] p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <h3 class="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1 relative z-10">AEO Readiness</h3>
            <div class="text-4xl font-black text-[#00b4d8] leading-none mb-1 relative z-10">${aiData?.aeo_readiness_score || 'N/A'}</div>
            <p class="text-[9px] text-gray-400 font-medium relative z-10">AI Model visibility</p>
          </div>
        </div>

        <!-- Executive Verdict -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6 avoid-break">
          <h2 class="text-lg font-black text-[#0A101D] mb-3"><span class="text-[#008dd8]">✨</span> AI Executive Verdict</h2>
          <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p class="text-xs text-gray-700 italic font-medium leading-relaxed">
              "${summary?.verdict || 'Analysis completed. Review the metrics below.'}"
            </p>
          </div>
        </div>

        <!-- Critical Fixes -->
        ${criticalFixes.length > 0 ? `
          <div class="bg-white border border-gray-200 p-6 rounded-2xl mb-6 avoid-break">
            <h3 class="text-base font-black text-[#0A101D] mb-4"><span class="text-red-500">❌</span> Critical Fixes Required</h3>
            <ul class="space-y-3">
              ${criticalFixes.map(fix => `
                <li class="flex items-start gap-3 text-sm text-gray-800 font-medium border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <span class="text-red-500 shrink-0 mt-0.5">•</span> ${fix}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- UK Local Opportunities -->
        ${localOps.length > 0 ? `
          <div class="bg-white border border-gray-200 p-6 rounded-2xl mb-6 avoid-break">
            <h3 class="text-base font-black text-[#0A101D] mb-4"><span class="text-[#008dd8]">📍</span> UK Local Opportunities</h3>
            <ul class="space-y-3">
              ${localOps.map(op => `
                <li class="flex items-start gap-3 text-sm text-gray-800 font-medium border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <span class="text-[#008dd8] shrink-0 mt-0.5">•</span> ${op}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Quick Wins -->
        ${quickWins.length > 0 ? `
          <div class="bg-white border border-gray-200 p-6 rounded-2xl mb-6 avoid-break">
            <h3 class="text-base font-black text-[#0A101D] mb-4"><span class="text-green-500">✅</span> Quick Wins</h3>
            <ul class="space-y-3">
              ${quickWins.map(winObj => `
                <li class="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col gap-2">
                  <strong class="text-gray-900 text-sm">${winObj.win || JSON.stringify(winObj)}</strong>
                  <div class="flex gap-2 text-[9px] font-bold mt-1 uppercase tracking-widest">
                    ${winObj.effort ? `<span class="bg-green-100 text-green-700 px-2 py-1 rounded">Effort: ${winObj.effort}</span>` : ''}
                    ${winObj.expected_impact ? `<span class="bg-[#008dd8]/10 text-[#008dd8] px-2 py-1 rounded">Impact: ${winObj.expected_impact}</span>` : ''}
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

      </body>
      </html>
    `;

    // 3. Launch Vercel-Friendly Headless Browser
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    
    const page = await browser.newPage();
    
    // 4. Load the HTML and wait for Tailwind to compile
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // 5. Generate PDF Buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, 
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();

    // 6. Return the raw PDF to the client
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="KlarAI_Report.pdf"`
      }
    });

  } catch (error) {
    console.error('Server PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF. Check server logs.' }, 
      { status: 500 }
    );
  }
}