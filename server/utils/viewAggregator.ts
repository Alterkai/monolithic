// server/utils/viewAggregator.ts
import { getRedisClient } from "./redis";
import { db } from "./db"; // Asumsikan Anda punya koneksi DB di sini
import type { Redis } from "ioredis";

const REDIS_MANGA_VIEW_KEY_PREFIX = "views:pending:manga:";
const REDIS_CHAPTER_VIEW_KEY_PREFIX = "views:pending:chapter:"; // Kunci baru untuk chapter
const DEBOUNCE_INTERVAL_MS = 5000; // 5 detik debounce
const FLUSH_INTERVAL_MS = 60 * 1000; // Flush setiap 1 menit (untuk scheduler)

let redis: Redis;

// Menggunakan Map di memori sebagai fallback timer manager
const debounceTimers = new Map<string, NodeJS.Timeout>(); // Kunci sekarang string (mangaId atau mangaId:chapterId)

// --- Fungsi untuk Manga Views (sedikit modifikasi) ---
export async function incrementMangaViewCount(mangaId: number) {
  if (!redis) {
    redis = getRedisClient();
  }

  const redisKey = REDIS_MANGA_VIEW_KEY_PREFIX + mangaId;
  await redis.incr(redisKey);

  // Kunci timer sekarang adalah ID manga
  const timerKey = `manga:${mangaId}`;
  if (debounceTimers.has(timerKey)) {
    clearTimeout(debounceTimers.get(timerKey)!);
  }
  const timer = setTimeout(async () => {
    await flushSingleMangaView(mangaId);
    debounceTimers.delete(timerKey);
  }, DEBOUNCE_INTERVAL_MS);
  debounceTimers.set(timerKey, timer);
}

async function flushSingleMangaView(mangaId: number) {
  if (!redis) {
    redis = getRedisClient();
  }

  const redisKey = REDIS_MANGA_VIEW_KEY_PREFIX + mangaId;
  const pendingCountStr = await redis.getdel(redisKey);
  const pendingCount = pendingCountStr ? parseInt(pendingCountStr, 10) : 0;

  if (pendingCount > 0) {
    console.log(`Flushing ${pendingCount} views for manga ${mangaId} to DB.`);
    try {
      await db.query(
        `
        INSERT INTO manga_views (manga_id, total_views, date_added)
        VALUES ($1, $2, NOW())
        ON CONFLICT (manga_id) DO UPDATE SET
          total_views = manga_views.total_views + EXCLUDED.total_views,
          date_added = NOW();
      `,
        [mangaId, pendingCount]
      );
      console.log(
        `Successfully flushed ${pendingCount} views for manga ${mangaId}.`
      );
    } catch (error) {
      console.error(`Error flushing manga views for ${mangaId}:`, error);
    }
  }
}

// --- Fungsi Baru untuk Chapter Views ---
export async function incrementChapterViewCount(
  mangaId: number,
  chapterId: number
) {
  if (!redis) {
    redis = getRedisClient();
  }

  const redisKey = `${REDIS_CHAPTER_VIEW_KEY_PREFIX}${mangaId}:${chapterId}`;
  await redis.incr(redisKey);

  // Kunci timer untuk chapter views
  const timerKey = `chapter:${mangaId}:${chapterId}`;
  if (debounceTimers.has(timerKey)) {
    clearTimeout(debounceTimers.get(timerKey)!);
  }
  const timer = setTimeout(async () => {
    await flushSingleChapterView(mangaId, chapterId);
    debounceTimers.delete(timerKey);
  }, DEBOUNCE_INTERVAL_MS);
  debounceTimers.set(timerKey, timer);
}

async function flushSingleChapterView(mangaId: number, chapterId: number) {
  if (!redis) {
    redis = getRedisClient();
  }

  const redisKey = `${REDIS_CHAPTER_VIEW_KEY_PREFIX}${mangaId}:${chapterId}`;
  const pendingCountStr = await redis.getdel(redisKey);
  const pendingCount = pendingCountStr ? parseInt(pendingCountStr, 10) : 0;

  if (pendingCount > 0) {
    console.log(
      `Flushing ${pendingCount} views for chapter ${mangaId}:${chapterId} to DB.`
    );
    try {
      await db.query(
        `
        INSERT INTO chapter_views (manga_id, chapter_id, total_views, date_added)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (manga_id, chapter_id) DO UPDATE SET
          total_views = chapter_views.total_views + EXCLUDED.total_views,
          date_added = NOW();
      `,
        [mangaId, chapterId, pendingCount]
      );
      console.log(
        `Successfully flushed ${pendingCount} views for chapter ${mangaId}:${chapterId}.`
      );
    } catch (error) {
      console.error(
        `Error flushing chapter views for ${mangaId}:${chapterId}:`,
        error
      );
    }
  }
}

// --- Fungsi untuk Flush Semua Views (Manga dan Chapter) ---
export async function flushAllPendingViews() {
  if (!redis) {
    redis = getRedisClient();
  }

  console.log("Running scheduled flush for all pending views...");

  // Flush Manga Views
  const mangaKeys = await redis.keys(REDIS_MANGA_VIEW_KEY_PREFIX + "*");
  for (const key of mangaKeys) {
    const mangaId = parseInt(key.replace(REDIS_MANGA_VIEW_KEY_PREFIX, ""), 10);
    const timerKey = `manga:${mangaId}`;
    if (debounceTimers.has(timerKey)) {
      clearTimeout(debounceTimers.get(timerKey)!);
      debounceTimers.delete(timerKey);
    }
    await flushSingleMangaView(mangaId);
  }

  // Flush Chapter Views
  const chapterKeys = await redis.keys(REDIS_CHAPTER_VIEW_KEY_PREFIX + "*");
  for (const key of chapterKeys) {
    // Format kunci: views:pending:chapter:mangaId:chapterId
    const parts = key.replace(REDIS_CHAPTER_VIEW_KEY_PREFIX, "").split(":");
    const mangaId = parseInt(parts[0], 10);
    const chapterId = parseInt(parts[1], 10);

    const timerKey = `chapter:${mangaId}:${chapterId}`;
    if (debounceTimers.has(timerKey)) {
      clearTimeout(debounceTimers.get(timerKey)!);
      debounceTimers.delete(timerKey);
    }
    await flushSingleChapterView(mangaId, chapterId);
  }

  console.log("Scheduled flush complete.");
}
