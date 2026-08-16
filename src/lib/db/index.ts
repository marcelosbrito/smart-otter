import { getDb } from './client';

export async function initDatabase(): Promise<void> {
	try {
		await getDb();
	} catch (err) {
		console.error('Failed to initialize database:', err);
	}
}
