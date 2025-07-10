import { db } from "~/utils/db";
import path from "path";
import { randomUUID } from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";

export default defineEventHandler(async (event) => {
  try {
    // Check content type untuk determine parsing method
    const contentType = getHeader(event, "content-type") || "";

    let formData: Record<string, any> = {};
    let coverFile: any = null;

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload (multipart form data)
      const form = await readMultipartFormData(event);

      if (!form) {
        throw createError({
          statusCode: 400,
          statusMessage: "No form data provided",
        });
      }

      // Parse form fields
      for (const field of form) {
        if (field.name === "cover" && field.filename) {
          coverFile = field;
        } else if (field.name) {
          formData[field.name] = field.data.toString();
        }
      }

      // Parse genre dari string ke array
      if (formData.genre) {
        formData.genre = formData.genre.split(",").map((g: string) => g.trim());
      }

      // Parse ratings ke number
      if (formData.ratings) {
        formData.ratings = parseFloat(formData.ratings);
      }
    } else {
      // Handle regular JSON body (for API calls without file)
      formData = await readBody(event);
    }

    const { title, original_title, description, author, ratings, genre } =
      formData;
    let coverPath = formData.cover || "";

    // Handle file upload jika ada
    if (coverFile && coverFile.data) {
      // Generate unique filename
      const fileExtension = path
        .extname(coverFile.filename || "")
        .toLowerCase();
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

      if (!allowedExtensions.includes(fileExtension)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid file type. Only images are allowed.",
        });
      }

      // save to blob storage
      const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
      const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
      const cdnURL = process.env.CDN_URL;

      if (!connectionString || !containerName || !cdnURL) {
        throw createError({
          statusCode: 500,
          statusMessage: "Server configuration is incomplete.",
        });
      }

      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const uniqueFilename = `${randomUUID()}${fileExtension}`;
      const blockBlobClient =
        containerClient.getBlockBlobClient(uniqueFilename);

      // Upload data buffer to Azure Blob Storage
      await blockBlobClient.uploadData(coverFile.data, {
        blobHTTPHeaders: { blobContentType: coverFile.type },
      });

      // Set coverPath to the public URL of the uploaded blob
      coverPath = `${cdnURL}/${containerName}/${uniqueFilename}`;
    }

    // Basic validation for required fields
    if (
      !title ||
      !author ||
      !coverPath ||
      typeof ratings !== "number" ||
      !genre ||
      !Array.isArray(genre)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing or invalid data for manga creation.",
      });
    }

    let client;

    try {
      client = await db.connect(); // Get a dedicated client from the pool
      await client.query("BEGIN;"); // Start the transaction
      await client.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;"); // Strongest isolation level

      // Insert manga and get its ID
      const insertMangaResult = await client.query(
        `INSERT INTO manga (title, original_title, description, author, cover, ratings)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [title, original_title, description, author, coverPath, ratings]
      );

      if (insertMangaResult.rows.length === 0) {
        throw new Error("Failed to retrieve new manga ID.");
      }
      const mangaId = insertMangaResult.rows[0].id; // New manga ID

      // Add genres for the new manga
      for (const genreName of genre) {
        await client.query(`SELECT add_manga_genre($1, $2)`, [
          mangaId,
          genreName,
        ]);
      }

      await client.query("COMMIT;"); // Commit the transaction

      return {
        success: true,
        statusCode: 201,
        message: "Manga and genres added successfully!",
        data: {
          mangaId: mangaId,
          cover: coverPath,
          title: title,
        },
      };
    } catch (error: any) {
      if (client) {
        await client.query("ROLLBACK;"); // Rollback on error
      }

      // NOTE: Local file cleanup logic is removed as
      // it's no longer needed with direct Azure Blob Storage upload

      console.error("Error adding manga and genres:", error);

      throw createError({
        statusCode: 500,
        statusMessage:
          "Failed to add manga and genres due to a database error.",
        data: error.message,
      });
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
    }
  } catch (error: any) {
    console.error("Error in manga creation:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal server error",
    });
  }
});
