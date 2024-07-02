import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const analysisName = data.get('analysisName')?.toString() || '';
    const file1 = data.get('file1') as File;
    const file2 = data.get('file2') as File;

    if (!file1 || !file2 || !analysisName) {
      return NextResponse.json({ success: false, error: 'Missing files or analysis name' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const file1Path = path.join(uploadDir, file1.name);
    const file2Path = path.join(uploadDir, file2.name);

    await fs.promises.writeFile(file1Path, Buffer.from(await file1.arrayBuffer()));
    await fs.promises.writeFile(file2Path, Buffer.from(await file2.arrayBuffer()));

    return NextResponse.json({
      success: true,
      file1Path,
      file2Path,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
