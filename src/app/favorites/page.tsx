'use client';

import { useEffect, useState } from 'react';
import { getFavoritesAction, removeFavoriteAction } from '@/lib/db/actions/favorites';
import type { Favorite } from '@/lib/db/repositories/favorites';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function FavoritesPage() {
	const [favorites, setFavorites] = useState<Favorite[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getFavoritesAction().then((data) => {
			setFavorites(data);
			setLoading(false);
		});
	}, []);

	async function handleRemove(id: number) {
		await removeFavoriteAction(id);
		setFavorites((prev) => prev.filter((f) => f.id !== id));
	}

	if (loading) {
		return (
			<div className="max-w-3xl mx-auto px-6 py-12" role="status" aria-busy="true">
				<h1 className="text-2xl font-bold mb-8">Favorites</h1>
				<p className="text-muted-foreground" aria-label="Loading favorites">Loading...</p>
			</div>
		);
	}

	const grouped = new Map<string, Favorite[]>();
	for (const fav of favorites) {
		const existing = grouped.get(fav.profession) || [];
		existing.push(fav);
		grouped.set(fav.profession, existing);
	}

	return (
		<div className="max-w-3xl mx-auto px-6 py-12" role="main">
			<h1 className="text-2xl font-bold mb-8">Favorites</h1>

			{grouped.size === 0 && (
				<p className="text-muted-foreground text-center py-12" role="status">No favorites saved yet.</p>
			)}

			<div aria-label="Saved favorites list">
				{Array.from(grouped.entries()).map(([profession, items]) => (
					<section key={profession} className="mb-8">
						<h2 className="text-lg font-semibold mb-4">{profession}</h2>
						<div className="space-y-3" role="list">
							{items.map((fav) => (
								<Card key={fav.id} role="listitem">
									<CardContent className="p-4">
										<div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
											<div>
												<a href={fav.resource_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{fav.resource_name}</a>
												<p className="text-sm text-muted-foreground mt-1">{fav.explanation}</p>
												<span className="inline-block mt-2 text-xs bg-secondary px-2 py-1 rounded" aria-label={`Category: ${fav.category}`}>{fav.category}</span>
											</div>
											<Button variant="ghost" size="sm" onClick={() => handleRemove(fav.id)} aria-label={`Remove ${fav.resource_name} from favorites`} className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none">
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
