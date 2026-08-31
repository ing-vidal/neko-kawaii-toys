import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawFilename = searchParams.get('filename') || 'image.jpg';
    
    // Sanitize filename and add unique timestamp prefix
    const cleanFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${cleanFilename}`;

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    // If running in Vercel or BLOB_READ_WRITE_TOKEN is configured, use Vercel Blob
    if (blobToken || process.env.VERCEL) {
      if (!blobToken) {
        return NextResponse.json(
          {
            error:
              'No se encontró la variable de entorno BLOB_READ_WRITE_TOKEN. Por favor, crea un Vercel Blob Store en el panel de Vercel.',
          },
          { status: 500 }
        );
      }

      const blob = await put(`neko-kawaii/${filename}`, request.body!, {
        access: 'public',
      });

      return NextResponse.json({ url: blob.url });
    }

    // Local development fallback when BLOB_READ_WRITE_TOKEN is not set
    const buffer = Buffer.from(await request.arrayBuffer());
    
    // Determine public/uploads directory
    const cwd = process.cwd();
    const uploadsDir = cwd.includes('apps/web') || cwd.includes('apps\\web')
      ? path.join(cwd, 'public', 'uploads')
      : path.join(cwd, 'apps', 'web', 'public', 'uploads');

    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    const localUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: localUrl });
  } catch (error: unknown) {
    console.error('Error uploading image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al subir la imagen';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
