// server/api/views/[mangaId].ts
import { incrementMangaViewCount } from "~/server/utils/viewAggregator";

export default defineEventHandler(async (event) => {
  const mangaId = getRouterParam(event, "mangaID");

  console.log("Manga ID:", mangaId);

  if (mangaId === undefined || mangaId === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Manga ID",
    });
  }

  await incrementMangaViewCount(parseInt(mangaId));

  return { status: "ok", message: "View recorded for aggregation" };
});
