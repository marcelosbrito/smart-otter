import * as path from 'path';
import * as fs from 'fs';
import initSqlJs, { Database } from 'sql.js';

const DB_PATH = path.join(process.cwd(), '.data', 'smart-otter.db');

let SQL: any;
let db: Database | null = null;

async function initJs(): Promise<any> {
	if (!SQL) {
		const init = await initSqlJs();
		SQL = init;
		return SQL;
	}
	return SQL;
}

export async function getDb(): Promise<Database> {
	if (db) {
		return db;
	}

	await initJs();

	const dir = path.dirname(DB_PATH);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	let dbBuffer: Uint8Array;

	if (fs.existsSync(DB_PATH)) {
		const fileData = fs.readFileSync(DB_PATH);
		dbBuffer = new Uint8Array(fileData);
	} else {
		dbBuffer = new Uint8Array();
	}

	const instance = new SQL.Database(dbBuffer);
	runMigrations();
	saveDb();
	db = instance;
	return db;
}

export function runMigrations(): void {
	if (!db) return;

	const migrations = [
		`CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			clerk_id TEXT UNIQUE NOT NULL,
			email TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS favorites (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id TEXT NOT NULL,
			profession TEXT NOT NULL,
			resource_name TEXT NOT NULL,
			resource_url TEXT NOT NULL,
			category TEXT NOT NULL,
			explanation TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(clerk_id)
		)`,
		`CREATE INDEX IF NOT EXISTS idx_favorites_user_profession ON favorites(user_id, profession)`,
		`CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id)`,
	];

	for (const migration of migrations) {
		try {
			db!.exec(migration);
		} catch (err: any) {
			console.warn(`Migration warning: ${err.message}`);
		}
	}
}

export function saveDb(): void {
	if (!db) return;

	const dir = path.dirname(DB_PATH);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const data = db.export();
	const buffer = Buffer.from(data);
	fs.writeFileSync(DB_PATH, buffer);
}

export async function closeDb(): Promise<void> {
	if (db) {
		saveDb();
		db.close();
		db = null;
	}
}
