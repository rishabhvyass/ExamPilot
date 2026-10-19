// SQLite (op-sqlite) for data that outgrows key-value storage: the extracted text of every study PDF,
// indexed with FTS5 so Focus read opens instantly and the assistant can quote the student's own notes.
import { open, type DB } from '@op-engineering/op-sqlite';

let db: DB | null = null;
function conn(): DB {
  if (db) return db;
  db = open({ name: 'exampilot.sqlite' });
  db.executeSync(
    `CREATE TABLE IF NOT EXISTS pdf_page (
       material_id TEXT NOT NULL,
       page INTEGER NOT NULL,
       text TEXT NOT NULL,
       PRIMARY KEY (material_id, page)
     )`,
  );
  db.executeSync(
    'CREATE VIRTUAL TABLE IF NOT EXISTS pdf_fts USING fts5(material_id UNINDEXED, page UNINDEXED, text)',
  );
  return db;
}

/** Stores (or replaces) the text of every page of one PDF. */
export async function savePdfText(materialId: string, pages: string[]) {
  await conn().transaction(async tx => {
    await tx.execute('DELETE FROM pdf_page WHERE material_id = ?', [materialId]);
    await tx.execute('DELETE FROM pdf_fts WHERE material_id = ?', [materialId]);
    for (let i = 0; i < pages.length; i++) {
      const text = pages[i] ?? '';
      await tx.execute(
        'INSERT INTO pdf_page (material_id, page, text) VALUES (?, ?, ?)',
        [materialId, i + 1, text],
      );
      if (text.trim())
        await tx.execute(
          'INSERT INTO pdf_fts (material_id, page, text) VALUES (?, ?, ?)',
          [materialId, i + 1, text],
        );
    }
  });
}

/** Page texts in order, or null if this PDF hasn't been read yet. */
export async function loadPdfText(materialId: string): Promise<string[] | null> {
  const r = await conn().execute(
    'SELECT text FROM pdf_page WHERE material_id = ? ORDER BY page',
    [materialId],
  );
  return r.rows.length ? r.rows.map(x => String(x.text ?? '')) : null;
}

export const hasPdfText = async (materialId: string) =>
  (
    await conn().execute(
      'SELECT 1 FROM pdf_page WHERE material_id = ? LIMIT 1',
      [materialId],
    )
  ).rows.length > 0;

export async function forgetPdfText(materialId: string) {
  await conn().execute('DELETE FROM pdf_page WHERE material_id = ?', [materialId]);
  await conn().execute('DELETE FROM pdf_fts WHERE material_id = ?', [materialId]);
}

export type NoteHit = { materialId: string; page: number; snippet: string };

/** Full-text search across the student's PDFs; best matches first. */
export async function searchPdfText(
  query: string,
  materialIds?: string[],
  limit = 5,
): Promise<NoteHit[]> {
  // FTS5 query: each meaningful word as a quoted prefix term, any of them may match.
  const words = (query.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? []).slice(0, 12);
  if (!words.length) return [];
  const match = words.map(w => `"${w}"*`).join(' OR ');
  const ids = materialIds?.length
    ? ` AND material_id IN (${materialIds.map(() => '?').join(',')})`
    : '';
  const r = await conn().execute(
    `SELECT material_id, page, snippet(pdf_fts, 2, '', '', '…', 40) AS snip
       FROM pdf_fts WHERE pdf_fts MATCH ?${ids}
       ORDER BY bm25(pdf_fts) LIMIT ?`,
    [match, ...(materialIds ?? []), limit],
  );
  return r.rows.map(x => ({
    materialId: String(x.material_id),
    page: Number(x.page),
    snippet: String(x.snip ?? '').replace(/\s+/g, ' ').trim(),
  }));
}
