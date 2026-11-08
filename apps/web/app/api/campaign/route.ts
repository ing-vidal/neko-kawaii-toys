import { NextResponse } from 'next/server';
import { getActiveCampaignId } from '@lib/campaigns';
import { readAdminConfig } from '../admin/utils';

export const dynamic = 'force-dynamic';

function mexicoCityDate(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export async function GET() {
  try {
    const config = await readAdminConfig();
    return NextResponse.json({
      campaignId: getActiveCampaignId(config.campaigns, mexicoCityDate()),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error loading active campaign:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
