'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { Favorite } from '@/lib/db/repositories/favorites';
import { saveFavorite as repoSave, removeFavorite as repoRemove, getFavorites as repoGet, hasFavorite as repoHas } from '@/lib/db/repositories/favorites';

export async function saveResource(data: { profession: string; resourceName: string; resourceUrl: string; category: string; explanation?: string }) {
	const { userId } = await auth();
	if (!userId) {
		redirect('/sign-in?redirect=/search');
	}

	return repoSave(userId, data.profession, data.resourceName, data.resourceUrl, data.category, data.explanation);
}

export async function removeFavoriteAction(id: number) {
	const { userId } = await auth();
	if (!userId) {
		redirect('/sign-in?redirect=/favorites');
	}

	await repoRemove(id);
}

export async function getFavoritesAction(profession?: string): Promise<Favorite[]> {
	const { userId } = await auth();
	if (!userId) {
		return [];
	}

	return repoGet(userId, profession);
}

export async function checkFavoriteExists(data: { profession: string; resourceName: string }) {
	const { userId } = await auth();
	if (!userId) {
		return false;
	}

	return repoHas(userId, data.profession, data.resourceName);
}
