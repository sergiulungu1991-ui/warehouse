import { NextRequest, NextResponse } from 'next/server';

type DriveImportRequest = {
  fileId: string;
  accessToken: string;
  name: string;
};

const DRIVE_DOWNLOAD_BASE = 'https://www.googleapis.com/drive/v3/files';
const IMGBB_UPLOAD_BASE = 'https://api.imgbb.com/1/upload';

export async function POST(request: NextRequest) {
  try {
    const { fileId, accessToken, name } = (await request.json()) as DriveImportRequest;

    if (!fileId || !accessToken) {
      return NextResponse.json({ error: 'fileId and accessToken are required' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'IMGBB_API_KEY is not configured' }, { status: 500 });
    }

    const driveResponse = await fetch(`${DRIVE_DOWNLOAD_BASE}/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!driveResponse.ok) {
      const text = await driveResponse.text().catch(() => 'Unknown Drive error');
      return NextResponse.json({ error: `Failed to fetch image from Drive: ${text}` }, { status: 502 });
    }

    const blob = await driveResponse.blob();
    const file = new File([blob], name || 'drive-import.jpg', { type: blob.type || 'image/jpeg' });

    const imgbbFormData = new FormData();
    imgbbFormData.append('image', file);

    const imgbbResponse = await fetch(`${IMGBB_UPLOAD_BASE}?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const data = await imgbbResponse.json();

    if (!data.success) {
      return NextResponse.json({ error: 'Failed to upload image to ImgBB' }, { status: 500 });
    }

    return NextResponse.json({ url: data.data.url });
  } catch (error) {
    console.error('Drive import error:', error);
    return NextResponse.json({ error: 'Failed to import image from Drive' }, { status: 500 });
  }
}
