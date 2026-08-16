import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'IMGBB_API_KEY is not configured' }, { status: 500 });
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ error: 'Failed to upload image to ImgBB' }, { status: 500 });
    }

    return NextResponse.json({ url: data.data.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
