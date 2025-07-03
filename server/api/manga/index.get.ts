import { db } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  let id = getQuery(event).id as string | undefined;
  let manga: any[] = [];

  // Retrieve all manga (no ID provided)
  if (id == "undefined" || id == undefined) {
    const result = await db.query(
      `
      SELECT ID, title, original_title, description, author, cover, ratings
      FROM manga`
    )
    manga = result.rows;
    return manga.map((m) => ({
      id: m.ID,
      title: m.title,
      original_title: m.original_title,
      description: m.description,
      author: m.author,
      cover: m.cover,
      ratings: m.ratings,
    }));
  }
  
  else {
    // Retrieve manga by ID
    // Also retrieve all chapters
    const result = await db.query(
      `SELECT * FROM manga_with_chapters
      WHERE manga_id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Manga not found",
      });
    }
    manga = result.rows;

    return manga.map((m) => ({
      id: m.manga_id,
      title: m.manga_title,
      original_title: m.manga_original_title,
      description: m.manga_description,
      author: m.manga_author,
      cover: m.manga_cover,
      ratings: m.manga_ratings,
      chapters: m.chapters.map((chapter: any) => ({
        id: chapter.id,
        name: chapter.name,
        number: chapter.number,
        date_added: chapter.date_added,
      })),
    }))
  }
})