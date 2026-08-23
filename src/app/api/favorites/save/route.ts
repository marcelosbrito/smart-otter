import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

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

		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !serviceRoleKey) {
			console.error('[favorites] Missing Supabase credentials');
			return NextResponse.json(
				{ error: 'Database not configured' },
				{ status: 500 }
			);
		}

		const baseUrl = supabaseUrl.replace('https://', '').replace('http://', '');
		const fullUrl = `https://${baseUrl}/rest/v1/favorites`;

		console.log('[favorites] Checking existing favorite for user:', userId, 'resource:', resourceName);

		// Check if already saved
		const checkRes = await fetch(`${fullUrl}?user_id=eq.${userId}&resource_name=eq.${encodeURIComponent(resourceName)}&limit=1`, {
			headers: {
				'apikey': serviceRoleKey,
				'Authorization': `Bearer ${serviceRoleKey}`,
				'Prefer': 'return=minimal',
			},
		});

		if (checkRes.ok) {
			const existing = await checkRes.json();
			if (existing.length > 0) {
				console.log('[favorites] Already saved');
				return NextResponse.json({ success: true, favorite: null, alreadySaved: true });
			}
		} else {
			console.warn('[favorites] Check error:', await checkRes.text());
		}

		// Insert the favorite
		const insertBody = JSON.stringify({
			user_id: userId,
			profession,
			resource_name: resourceName,
			resource_url: resourceUrl || '',
			category,
			explanation: explanation || null,
		});

		console.log('[favorites] Inserting:', insertBody);

		const insertRes = await fetch(fullUrl, {
			method: 'POST',
			headers: {
				'apikey': serviceRoleKey,
				'Authorization': `Bearer ${serviceRoleKey}`,
				'Content-Type': 'application/json',
				'Prefer': 'return=representation',
			},
			body: insertBody,
		});

		const insertText = await insertRes.text();
		console.log('[favorites] Insert response:', insertRes.status, insertText);

		if (!insertRes.ok) {
			return NextResponse.json(
				{ error: `Failed to save favorite: ${insertText}` },
				{ status: 500 }
			);
		}

		const data = JSON.parse(insertText);
		console.log('[favorites] Saved successfully:', data[0]?.id);

		return NextResponse.json({ success: true, favorite: data[0] });
	} catch (err: any) {
		console.error('[favorites] Unexpected error:', err);
		return NextResponse.json(
			{ error: err.message || 'Failed to save favorite' },
			{ status: 500 }
		);
	}
}
