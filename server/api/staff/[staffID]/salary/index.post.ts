export default defineEventHandler(async (event) => {
  let staff_id = getRouterParam(event, "staffID") as string | undefined;
  if (!staff_id) {
    throw createError({
      statusCode: 400,
      message: "Staff ID is required",
    });
  }

  const body = await readBody(event);
  const { amount } = body;
  // apakah jumlah gaji mau diitung disini atau dari frontend?
  // dimana naro fee ratenya?
  // nunggu v1.5 ae palingan awokwk
})