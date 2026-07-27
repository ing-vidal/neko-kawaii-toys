import { NextResponse } from 'next/server';
import { readAdminConfig, writeAdminConfig, defaultAdminConfig } from '../utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isKvEnabled = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    if (searchParams.get('clear') === 'true') {
      await writeAdminConfig(defaultAdminConfig);
      return NextResponse.json({
        ...defaultAdminConfig,
        kvConfigured: isKvEnabled
      });
    }
    const config = await readAdminConfig();
    return NextResponse.json({
      ...config,
      kvConfigured: isKvEnabled
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updates = (await request.json()) as Partial<Awaited<ReturnType<typeof readAdminConfig>>>;
    const currentConfig = await readAdminConfig();
    const nextConfig = {
      ...currentConfig,
      ...updates,
    };
    await writeAdminConfig(nextConfig);
    return NextResponse.json(nextConfig);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error updating config:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
