<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <UForm @submit="onSubmit" :state="state" :schema="schema" class="flex flex-col gap-2 w-[20rem]">

      <h1 class="font-bold text-2xl mb-2">Login</h1>

      <UFormField label="Email" name="email">
        <UInput size="xl" class="w-full" v-model="state.email" type="email" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput size="xl" class="w-full" v-model="state.password" :type="show ? 'text' : 'password'">
          <template #trailing>
            <UButton color="neutral" variant="link" size="sm" :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show" aria-controls="password"
              @click="show = !show" />
          </template>
        </UInput>
      </UFormField>


      <UButton size="xl" v-if="isLoading" class="mt-4 justify-center" loading>Loading</UButton>
      <UButton size="xl" v-else type="submit" class="mt-4 justify-center">Login</UButton>

      <ULink to="/register" class="text-center text-sm" size="xl">
        Register
      </ULink>
    </UForm>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import * as z from 'zod';
import apiClient from '~/utils/apiClient';
import type { LoginResponse } from '~/types';

const redirect = useRoute().query.redirect as string | undefined;

const authStore = useAuthStore();
const show = ref(false);
const isLoading = ref(false);
const toast = useToast();

const schema = z.object({
  email: z.string().email('Invalid email address')
    .min(1, 'Email is required')
    .max(100, 'Email must be at most 100 characters long'),
  password: z.string()
})

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

async function onSubmit() {
  try {
    isLoading.value = true;
    const response = await apiClient.auth.login(state as { email: string, password: string });

    if (response && response.user) {
      authStore.setUser(response.user);
      if (redirect) navigateTo(redirect);
      else navigateTo('/');
    }
  } catch (error) {
    toast.add({
      title: 'Wrong Password / Email!',
      description: 'Wrong password or email, please try again.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>