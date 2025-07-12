import { db } from "~/server/utils/db";
import path from "path";
import { randomUUID } from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";

export default defineEventHandler(async (event) => {
  const mangaId = getRouterParam(event, "mangaID");
  if (!mangaId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Manga ID is required",
    });
  }

  try {
    const contentType = getHeader(event, "content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      throw createError({
        statusCode: 415,
        statusMessage:
          "Unsupported Media Type: multipart/form-data is required.",
      });
    }

    const form = await readMultipartFormData(event);
    if (!form) {
      throw createError({
        statusCode: 400,
        statusMessage: "No form data provided",
      });
    }

    const formData: Record<string, any> = {};
    let coverFile: any = null;

    // Parse form fields
    for (const field of form) {
      if (field.name === "cover" && field.filename) {
        coverFile = field;
      } else if (field.name) {
        formData[field.name] = field.data.toString();
      }
    }

    // Parse genre dari string ke array jika ada
    if (formData.genre) {
      formData.genre = formData.genre.split(",").map((g: string) => g.trim());
    }
    // Parse ratings ke number jika ada
    if (formData.ratings) {
      formData.ratings = parseFloat(formData.ratings);
    }

    let coverPath: string | undefined = undefined;

    // Handle file upload jika ada file baru
    if (coverFile && coverFile.data) {
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

      await blockBlobClient.uploadData(coverFile.data, {
        blobHTTPHeaders: { blobContentType: coverFile.type },
      });

      coverPath = `${cdnURL}/${containerName}/${uniqueFilename}`;
      // TODO: Consider deleting the old blob from Azure Storage to save space
    }

    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN;");

      // Build dynamic UPDATE query for manga table
      const updates: Record<string, any> = { ...formData };
      if (coverPath) {
        updates.cover = coverPath;
      }
      // Hapus genre dari update utama karena akan ditangani secara terpisah
      const newGenres = updates.genre;
      delete updates.genre;

      const updateFields = Object.keys(updates);
      if (updateFields.length > 0) {
        const setClauses = updateFields
          .map((key, index) => `"${key}" = $${index + 1}`)
          .join(", ");
        const values = updateFields.map((key) => updates[key]);

        await client.query(
          `UPDATE manga SET ${setClauses} WHERE id = $${
            updateFields.length + 1
          }`,
          [...values, mangaId]
        );
      }

      // Handle genre updates if provided
      if (newGenres && Array.isArray(newGenres)) {
        // PERBAIKAN: Hapus dari tabel junction 'manga_genres', bukan 'genre'
        await client.query(`DELETE FROM manga_genre WHERE manga_id = $1`, [
          mangaId,
        ]);

        // PERBAIKAN: Gunakan fungsi 'add_manga_genre' untuk menambahkan genre baru
        // Ini lebih aman dan mengikuti pola yang sudah ada.
        for (const genreName of newGenres) {
          if (genreName) {
            // Pastikan tidak ada string kosong
            await client.query(`SELECT add_manga_genre($1, $2)`, [
              mangaId,
              genreName,
            ]);
          }
        }
      }

      await client.query("COMMIT;");

      return {
        success: true,
        statusCode: 200,
        message: "Manga updated successfully!",
        data: { mangaId: parseInt(mangaId, 10) },
      };
    } catch (dbError: any) {
      if (client) {
        await client.query("ROLLBACK;");
      }
      console.error("Database error during manga update:", dbError);
      throw createError({
        statusCode: 500,
        statusMessage: "Database error: " + dbError.message,
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update manga: " + (error as Error).message,
    });
  }
});
