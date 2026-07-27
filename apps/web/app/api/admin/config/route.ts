import { NextResponse } from 'next/server';
import { readAdminConfig, writeAdminConfig } from '../utils';

export async function GET() {
  const config = await readAdminConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  const updates = (await request.json()) as Partial<Awaited<ReturnType<typeof readAdminConfig>>>;
  const currentConfig = await readAdminConfig();
  const nextConfig = {
    ...currentConfig,
    ...updates,
  };
  await writeAdminConfig(nextConfig);
  return NextResponse.json(nextConfig);
}
