import { NextResponse } from 'next/server';
import { publicDb } from '@/lib/server/db/publicStore';

// GET /api/v1/collections/recommendations — Public Recommendations Feed
// Returns only ACTIVE curated collections. Inactive collections are excluded.
// No private prompt text is ever exposed.
export async function GET() {
  const recommendations = publicDb.getPublicRecommendations();

  return NextResponse.json({
    recommendations,
    total: recommendations.length,
    timestamp: new Date().toISOString(),
  });
}
