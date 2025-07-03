export default defineEventHandler(async (event) => {
  let staff_id = getRouterParam(event, "staffID") as string | undefined;

  const result = await db.query(
    `
    SELECT payment_date, amount FROM salary
    WHERE user_id = $1
    ORDER BY payment_date DESC`,
    [staff_id]
  )
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Salary records not found for this staff member",
    });
  }
  return result.rows[0]
})