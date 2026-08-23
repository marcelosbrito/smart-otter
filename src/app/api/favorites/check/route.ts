import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { hasFavorite as repoHas } from '@/lib/db/repositories/favorites';

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
		const { profession, resources }: { profession: string; resources: string[] } = body;

		if (!profession || !resources?.length) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const saved: string[] = [];
		for (const resourceName of resources) {
			const exists = await repoHas(userId, profession, resourceName);
			if (exists) {
				saved.push(resourceName);
			}
		}

		return NextResponse.json({ saved });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err.message || 'Failed to check favorites' },
			{ status: 500 }
		);
	}
}
