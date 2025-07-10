// server/api/views/chapter/[mangaId]/[chapterId].ts
import { incrementChapterViewCount } from "~/server/utils/viewAggregator";

export default defineEventHandler(async (event) => {
  const mangaId = parseInt(getRouterParam(event, "mangaID") || "");
  const chapterId = parseInt(getRouterParam(event, "chapterID") || "");

  if (isNaN(mangaId) || isNaN(chapterId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Manga ID or Chapter ID",
    });
  }

  await incrementChapterViewCount(mangaId, chapterId);

  return { status: "ok", message: "Chapter view recorded for aggregation" };
});
