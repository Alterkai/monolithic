export default defineEventHandler(async (event) => {
  let manga_id = getRouterParam(event, "mangaID") as string | undefined;
  let chapter_id = getRouterParam(event, "chapterID") as number | undefined;

  if (!manga_id || !chapter_id) {
    throw createError({
      statusCode: 400,
      message: "Manga ID and Chapter ID are required",
    });
  }

  let body = await readBody(event);
  let { data } = body;
  // if ( data.page_number.isNumber || data.link.isURL) {
  //   throw createError({
  //     statusCode: 400,
  //     message: 'Page number must be a number and link must be a valid URL',
  //   });
  // }

  // ChapterID (params) == chapter_number (db)
  // page_number and link will come in batches/array of json
  chapter_id = parseInt(chapter_id.toString())
  let command = `INSERT INTO image (page_number, link, chapter_ID) VALUES `;
  let values: any = [];
  
  data.forEach((image: any, index: number) => {
    index *= 3;
    command += `($${index + 1}, $${index + 2}, $${index + 3}), `;
    values.push(image.page_number, image.link, chapter_id);
  });
  command = command.slice(0, -2);
  command += ` RETURNING id`;

  const result = await db.query(command, values);
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 500,
      message: "Failed to add images to chapter",
    });
  }
});
