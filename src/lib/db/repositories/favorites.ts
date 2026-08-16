import { getDb, saveDb } from '../client';

export interface Favorite {
	id: number;
	user_id: string;
	profession: string;
	resource_name: string;
	resource_url: string;
	category: string;
	explanation: string | null;
	created_at: string;
}

export async function saveFavorite(
	clerkId: string,
	profession: string,
	resourceName: string,
	resourceUrl: string,
	category: string,
	explanation?: string
): Promise<Favorite> {
	const db = await getDb();

	const userRows = db.exec(`SELECT id FROM users WHERE clerk_id = ?`, [clerkId]);
	if (userRows.length === 0 || !userRows[0]) {
		db.run(`INSERT INTO users (clerk_id) VALUES (?)`, [clerkId]);
	}

	const result = db.run(
		`INSERT INTO favorites (user_id, profession, resource_name, resource_url, category, explanation) 
		 VALUES (?, ?, ?, ?, ?, ?)`,
		[clerkId, profession, resourceName, resourceUrl, category, explanation || null]
	);

	saveDb();

	const maxRows = db.exec(`SELECT MAX(id) as last_id FROM favorites`);
	const lastId = (maxRows[0]?.values?.[0] as number[])?.[0] || 0;
	const rows = db.exec(
		`SELECT id, user_id, profession, resource_name, resource_url, category, explanation, created_at 
		 FROM favorites WHERE id = ?`,
		[lastId]
	);

	if (!rows[0] || !rows[0].values) {
		throw new Error('Failed to retrieve saved favorite');
	}

	const row = rows[0].values[0];
	return {
		id: row![0] as number,
		user_id: row![1] as string,
		profession: row![2] as string,
		resource_name: row![3] as string,
		resource_url: row![4] as string,
		category: row![5] as string,
		explanation: row![6] as string | null,
		created_at: row![7] as string,
	};
}

export async function removeFavorite(favoriteId: number): Promise<boolean> {
	const db = await getDb();

	db.run(`DELETE FROM favorites WHERE id = ?`, [favoriteId]);
	saveDb();

	return true;
}

export async function getFavorites(clerkId: string, profession?: string): Promise<Favorite[]> {
	const db = await getDb();

	let sql = `SELECT id, user_id, profession, resource_name, resource_url, category, explanation, created_at 
			   FROM favorites WHERE user_id = ?`;
	const params: any[] = [clerkId];

	if (profession) {
		sql += ` AND profession = ?`;
		params.push(profession);
	}

	sql += ` ORDER BY profession, created_at DESC`;

	const rows = db.exec(sql, params);

	if (!rows[0] || !rows[0].values) {
		return [];
	}

	const columns = rows[0].columns;
	const result: Favorite[] = [];

	for (const row of rows[0].values) {
		if (!row) continue;
		result.push({
			id: row[0] as number,
			user_id: row[1] as string,
			profession: row[2] as string,
			resource_name: row[3] as string,
			resource_url: row[4] as string,
			category: row[5] as string,
			explanation: row[6] as string | null,
			created_at: row[7] as string,
		});
	}

	return result;
}

export async function hasFavorite(
	clerkId: string,
	profession: string,
	resourceName: string
): Promise<boolean> {
	const db = await getDb();

	const rows = db.exec(
		`SELECT id FROM favorites WHERE user_id = ? AND profession = ? AND resource_name = ? LIMIT 1`,
		[clerkId, profession, resourceName]
	);

	if (!rows[0] || !rows[0].values || rows[0].values.length === 0) {
		return false;
	}

	return true;
}
