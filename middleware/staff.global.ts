export default defineNuxtRouteMiddleware((to, from) => {

  // Only allow access to admin routes if the user is an admin
  const authStore = useAuthStore();
  if (to.path.startsWith('/admin')) {
    if (!authStore.isLoggedIn || !authStore.user?.isStaff) {
      return navigateTo('/login?redirect=' + to.fullPath);
    }
  }

  // Only staff can access staff routes
  if (to.path.startsWith('/staff')) {
    if (!authStore.isLoggedIn || !authStore.user?.isStaff) {
      return navigateTo('/login?redirect=' + to.fullPath);
    }
  }
})