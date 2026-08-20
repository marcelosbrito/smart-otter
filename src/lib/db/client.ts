import * as path from 'path';
import { promises as fsp } from 'fs';
import initSqlJs, { Database } from 'sql.js';

const DB_PATH = path.join(process.cwd(), '.data', 'smart-otter.db');
const WASM_PATH = path.join(process.cwd(), '.data', 'sql-wasm.wasm');

let SQL: any;
let db: Database | null = null;

async function initJs(): Promise<any> {
	if (SQL) return SQL;

	const wasmData = await fsp.readFile(WASM_PATH);
	const wasmBuffer = new Uint8Array(wasmData).buffer as ArrayBuffer;

	const init = await initSqlJs({ wasmBinary: wasmBuffer });
	SQL = init;
	return SQL;
}

export async function getDb(): Promise<Database> {
	if (db) {
		return db;
	}

	try {
		await initJs();
	} catch (err) {
		console.error('[getDb] Initialization error:', err);
		throw err;
	}

	const dir = path.dirname(DB_PATH);
	try {
		await fsp.mkdir(dir, { recursive: true });
	} catch (err) {
		console.warn('[getDb] Could not create data directory:', err);
	}

	let dbBuffer: Uint8Array;

	if (await fsp.access(DB_PATH).then(() => true).catch(() => false)) {
		const fileData = await fsp.readFile(DB_PATH);
		dbBuffer = new Uint8Array(fileData);
	} else {
		dbBuffer = new Uint8Array();
	}

	const instance = new SQL.Database(dbBuffer);
	runMigrations();
	saveDb();
	db = instance;
	return instance;
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
	fsp.mkdir(dir, { recursive: true }).catch(() => {});

	const data = db.export();
	const buffer = Buffer.from(data);
	fsp.writeFile(DB_PATH, buffer).catch((err) => {
		console.error('[saveDb] Failed to write DB:', err);
	});
}

export async function closeDb(): Promise<void> {
	if (db) {
		saveDb();
		db.close();
		db = null;
	}
}
