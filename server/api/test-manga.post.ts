// server/api/test-manga.post.ts
export default defineEventHandler(async (event) => {
  console.log("Test endpoint hit");
  console.log("Method:", event.node.req.method);
  console.log("Headers:", getHeaders(event));

  try {
    const form = await readMultipartFormData(event);
    console.log("Form data received:", form?.length, "fields");

    return {
      success: true,
      message: "Test endpoint working",
      receivedFields: form?.map((f) => f.name) || [],
    };
  } catch (error) {
    console.error("Test endpoint error:", error);
    throw error;
  }
});
