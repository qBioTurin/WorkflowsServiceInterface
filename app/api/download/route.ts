import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { caseId, filename } = await req.json();

    const response = await fetch(`http://download-server:3001/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ caseId, filename }),
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Disposition': `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return new NextResponse('Failed to download file', { status: 500 });
  }
}
