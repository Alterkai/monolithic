import { BlobServiceClient } from "@azure/storage-blob";
import { v4 } from "uuid";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const mangaID = getRouterParam(event, "mangaID");
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
  const cdnURL = process.env.CDN_URL;

  if (!connectionString || !containerName || !mangaID || !cdnURL) {
    throw createError({
      statusCode: 500,
      message: "Server configuration is incomplete.",
    });
  }

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const client = await db.connect();

  try {
    const parts = await readMultipartFormData(event);
    if (!parts || parts.length === 0) {
      throw createError({ statusCode: 400, message: "Form data is missing." });
    }

    // 1. Extract data from form parts
    const chapterNumberPart = parts.find((p) => p.name === "chapterNumber");
    const chapterNamePart = parts.find((p) => p.name === "chapterName");
    const imageFiles = parts.filter(
      (p) => p.name === "files" && p.data.length > 0
    );

    if (!chapterNumberPart || imageFiles.length === 0) {
      throw createError({
        statusCode: 400,
        message: "Chapter number and at least one image are required.",
      });
    }

    const chapterNumber = chapterNumberPart.data.toString();
    const chapterName = chapterNamePart ? chapterNamePart.data.toString() : "";

    // 2. Upload all files to Azure concurrently
    const uploadPromises = imageFiles.map(async (file, index) => {
      const fileExtension = file.filename?.split(".").pop() || "webp";
      const blobName = `${v4()}.${fileExtension}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file.data, {
        blobHTTPHeaders: { blobContentType: file.type },
      });
      return { page_number: index + 1, link: `${cdnURL}/${containerName}/${blobName}` };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // 3. Perform database transaction
    await client.query("BEGIN");

    // 3a. Insert the new chapter
    const chapterInsertQuery = `
      INSERT INTO chapter (manga_ID, number, name) 
      VALUES ($1, $2, $3) 
      RETURNING ID
    `;
    const chapterResult = await client.query(chapterInsertQuery, [
      mangaID,
      chapterNumber,
      chapterName,
    ]);
    const newChapterId = chapterResult.rows[0].id;

    if (!newChapterId) {
      throw new Error("Failed to create new chapter entry.");
    }

    // 3b. Insert all images for the new chapter
    const imageValues: (string | number)[] = [];
    const valuePlaceholders = uploadedImages
      .map((img, index) => {
        const i = index * 3;
        imageValues.push(img.page_number, img.link, newChapterId);
        return `($${i + 1}, $${i + 2}, $${i + 3})`;
      })
      .join(", ");

    const imageInsertQuery = `INSERT INTO image (page_number, link, chapter_ID) VALUES ${valuePlaceholders}`;
    await client.query(imageInsertQuery, imageValues);

    await client.query("COMMIT");

    return {
      success: true,
      message: `Chapter ${chapterNumber} and ${uploadedImages.length} images added successfully.`,
      chapterId: newChapterId,
    };
  } catch (error: any) {
    await client
      .query("ROLLBACK")
      .catch((rbError) => console.error("Rollback failed:", rbError));
    console.error("Error processing chapter upload:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to process chapter upload.",
    });
  } finally {
    client.release();
  }
});
