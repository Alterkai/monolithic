// server/plugins/scheduler.ts
import { flushAllPendingViews } from "~/server/utils/viewAggregator";

export default defineNitroPlugin((nitroApp) => {
  let schedulerInterval: NodeJS.Timeout | null = null;

  nitroApp.hooks.hook("listen", () => {
    if (schedulerInterval) {
      clearInterval(schedulerInterval); // Pastikan tidak ada duplikat interval
    }
    console.log("Starting global view flush scheduler...");
    // Flush semua views yang tertunda setiap 1 menit (sesuaikan intervalnya)
    schedulerInterval = setInterval(async () => {
      await flushAllPendingViews();
    }, 60 * 1000); // Setiap 1 menit
  });

  // Optional: Clean up on server shutdown (important for local development restarts)
  nitroApp.hooks.hook("close", () => {
    if (schedulerInterval) {
      clearInterval(schedulerInterval);
      console.log("Global view flush scheduler stopped.");
    }
    // Perform one last flush on shutdown to minimize data loss
    console.log("Performing final view flush before shutdown...");
    flushAllPendingViews(); // No await needed, let it run in background
  });
});
