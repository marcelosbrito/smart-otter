import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { saveFavorite as repoSave } from '@/lib/db/repositories/favorites';

export async function POST(req: NextRequest) {
	const { userId } = await getAuth(req);

	if (!userId) {
		return NextResponse.json(
			{ redirect: '/sign-in' },
			{ status: 401 }
		);
	}

	try {
		const body = await req.json();
		const { profession, resourceName, resourceUrl, category, explanation } = body;

		if (!profession || !resourceName || !category) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const favorite = await repoSave(userId, profession, resourceName, resourceUrl || '', category, explanation);

		return NextResponse.json({ success: true, favorite });
	} catch (err: any) {
		console.error('[favorites/save] Error:', err.message || String(err));
		return NextResponse.json(
			{ error: err.message || 'Failed to save favorite' },
			{ status: 500 }
		);
	}
}
