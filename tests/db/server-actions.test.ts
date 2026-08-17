import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockDb = {
  exec: vi.fn(),
  run: vi.fn(),
  export: vi.fn(() => new Uint8Array()),
};
const saveDbMock = vi.fn();

vi.mock('@/lib/db/client', () => ({
  getDb: async () => mockDb,
  saveDb: saveDbMock,
}));

describe('Favorites Repository', () => {
  let favoritesRepo: typeof import('@/lib/db/repositories/favorites');

  beforeEach(() => {
    vi.resetAllMocks();
    mockDb.exec.mockReturnValue([]);
    mockDb.run.mockReturnValue({ changes: 1 });
    mockDb.export.mockReturnValue(new Uint8Array());
    saveDbMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('saveFavorite', () => {
    it('should insert user if not exists, then save favorite and return it', async () => {
      favoritesRepo = await import('@/lib/db/repositories/favorites');

      mockDb.exec.mockReturnValueOnce([])
        .mockReturnValueOnce([{ columns: ['id'], values: [[99]] }])
        .mockReturnValueOnce([
          { columns: ['id','user_id','profession','resource_name','resource_url','category','explanation','created_at'], 
            values: [[99,'clerk123','DevOps','Docker Docs','','Documentation',null,'2025-01-01']] },
        ]);

      const result = await favoritesRepo.saveFavorite('clerk123', 'DevOps', 'Docker Docs', '', 'Documentation');

      expect(mockDb.run).toHaveBeenCalledTimes(2);
      expect(mockDb.run).toHaveBeenCalledWith(
        `INSERT INTO favorites (user_id, profession, resource_name, resource_url, category, explanation) 
		 VALUES (?, ?, ?, ?, ?, ?)`,
        ['clerk123', 'DevOps', 'Docker Docs', '', 'Documentation', null]
      );
      expect(saveDbMock).toHaveBeenCalled();
      expect(result.id).toBe(99);
      expect(result.profession).toBe('DevOps');
    });

    it('should pass explanation to the insert statement', async () => {
      favoritesRepo = await import('@/lib/db/repositories/favorites');

      mockDb.exec.mockReturnValueOnce([])
        .mockReturnValueOnce([{ columns: ['id'], values: [[1]] }])
        .mockReturnValueOnce([
          { columns: ['id','user_id','profession','resource_name','resource_url','category','explanation','created_at'], 
            values: [[1,'u1','DevOps','Docker','','Docs','Help text','2025-01-01']] },
        ]);

      const result = await favoritesRepo.saveFavorite('u1', 'DevOps', 'Docker', '', 'Docs', 'Help text');

      expect(result.explanation).toBe('Help text');
    });
  });

  describe('removeFavorite', () => {
    it('should delete and return true', async () => {
      favoritesRepo = await import('@/lib/db/repositories/favorites');

      mockDb.run.mockReturnValue({ changes: 1 });

      const result = await favoritesRepo.removeFavorite(42);

      expect(mockDb.run).toHaveBeenCalledWith(`DELETE FROM favorites WHERE id = ?`, [42]);
      expect(saveDbMock).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('getFavorites', () => {
    it('should return empty array when no results', async () => {
      favoritesRepo = await import('@/lib/db/repositories/favorites');
      mockDb.exec.mockReturnValue([]);

      const result = await favoritesRepo.getFavorites('clerk123');
      expect(result).toEqual([]);
    });

    it('should return favorites for a user', async () => {
      favoritesRepo = await import('@/lib/db/repositories/favorites');
      mockDb.exec.mockReturnValue([
        {
          columns: ['id','user_id','profession','resource_name','resource_url','category','explanation','created_at'],
          values: [
            [1, 'clerk123', 'DevOps', 'Docker Docs', '', 'Documentation', null, '2025-01-01'],
            [2, 'clerk123', 'Frontend', 'React Docs', '', 'Documentation', 'Official React docs', '2025-01-02'],
          ],
        },
      ]);

      const result = await favoritesRepo.getFavorites('clerk123');
      expect(result).toHaveLength(2);
      expect(result[0].profession).toBe('DevOps');
      expect(result[1].resource_name).toBe('React Docs');
    });

    it('should filter by profession when provided', async () => {
      favoritesRepo = await import('@/lib/db/repositories/favorites');
      mockDb.exec.mockReturnValue([
        {
          columns: ['id','user_id','profession','resource_name','resource_url','category','explanation','created_at'],
          values: [[1, 'clerk123', 'DevOps', 'Docker Docs', '', 'Documentation', null, '2025-01-01']],
        },
      ]);

      await favoritesRepo.getFavorites('clerk123', 'DevOps');

      expect(mockDb.exec).toHaveBeenCalledWith(
        `SELECT id, user_id, profession, resource_name, resource_url, category, explanation, created_at 
			   FROM favorites WHERE user_id = ? AND profession = ? ORDER BY profession, created_at DESC`,
        ['clerk123', 'DevOps']
      );
    });
  });

  describe('hasFavorite', () => {
    it('should return false when not found', async () => {
      favoritesRepo = await import('@/lib/db/repositories/favorites');
      mockDb.exec.mockReturnValue([]);

      const result = await favoritesRepo.hasFavorite('clerk123', 'DevOps', 'Docker Docs');
      expect(result).toBe(false);
    });

    it('should return true when found', async () => {
      favoritesRepo = await import('@/lib/db/repositories/favorites');
      mockDb.exec.mockReturnValue([
        { columns: ['id'], values: [[1]] },
      ]);

      const result = await favoritesRepo.hasFavorite('clerk123', 'DevOps', 'Docker Docs');
      expect(result).toBe(true);
    });
  });
});
