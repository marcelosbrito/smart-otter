'use client';

import { useEffect, useState } from 'react';
import { getFavoritesAction, removeFavoriteAction } from '@/lib/db/actions/favorites';
import type { Favorite } from '@/lib/db/repositories/favorites';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, BookmarkPlus, AlertCircle } from 'lucide-react';

export default function FavoritesPage() {
	const [favorites, setFavorites] = useState<Favorite[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		getFavoritesAction().then((data) => {
			if (!cancelled) {
				setFavorites(data || []);
				setLoading(false);
			}
		}).catch((err) => {
			console.error('Failed to load favorites:', err);
			if (!cancelled) {
				setError(err instanceof Error ? err.message : 'Failed to load favorites');
				setLoading(false);
			}
		});
		return () => { cancelled = true; };
	}, []);

	async function handleRemove(id: number) {
		try {
			await removeFavoriteAction(id);
			setFavorites((prev) => prev.filter((f) => f.id !== id));
		} catch (err) {
			console.error('Failed to remove favorite:', err);
			setError(err instanceof Error ? err.message : 'Failed to remove favorite');
		}
	}

	if (loading) {
		return (
			<div className="max-w-3xl mx-auto px-6 py-12" role="status" aria-busy="true">
				<h1 className="text-2xl font-bold mb-8">Favorites</h1>
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-3xl mx-auto px-6 py-12">
				<h1 className="text-2xl font-bold mb-8">Favorites</h1>
				<div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
					<AlertCircle className="w-4 h-4 flex-shrink-0" />
					<p>{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto px-6 py-12" role="main">
			<h1 className="text-2xl font-bold mb-8">Favorites</h1>

			{favorites.length === 0 ? (
				<div className="text-center py-12" role="status">
					<BookmarkPlus className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
					<p className="text-muted-foreground text-lg">No favorites yet. Try searching for a profession and save resources you find useful.</p>
				</div>
			) : (
				<div aria-label="Saved favorites list">
					{Array.from(new Set(favorites.map((f) => f.profession))).map((profession) => {
						const items = favorites.filter((f) => f.profession === profession);
						return (
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
													<Button variant="ghost" size="sm" onClick={() => handleRemove(fav.id)} aria-label={`Remove ${fav.resource_name} from favorites`}>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</section>
						);
					})}
				</div>
			)}
		</div>
	);
}
