<template>
  <div class="w-screen h-screen flex items-center justify-center">

    <!-- Register Form -->
    <UForm :schema="schema" :state="state" @submit="onSubmit" class="flex flex-col gap-2 w-[20rem]">
      <h1 class="font-bold text-2xl mb-2">Register</h1>

      <UFormField label="Email" name="email">
        <UInput class="w-full" v-model="state.email" />
      </UFormField>

      <UFormField label="Name" name="name">
        <UInput class="w-full" v-model="state.name" />
      </UFormField>

      <UFormField label="Username" name="username">
        <UInput class="w-full" v-model="state.username" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput class="w-full" v-model="state.password" :type="show ? 'text' : 'password'">
          <template #trailing>
            <UButton color="neutral" variant="link" size="sm" :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show" aria-controls="password"
              @click="show = !show" />
          </template>
        </UInput>
      </UFormField>

      <UFormField label="Confirm Password" name="confirmPassword">
        <UInput class="w-full" v-model="state.confirmPassword" type="password" />
      </UFormField>

      <UButton v-if="isLoading" class="mt-4 justify-center" loading>Loading</UButton>
      <UButton v-else type="submit" class="mt-4 justify-center" size="lg">Register</UButton>

      <ULink to="/login" class="text-center text-sm">
        Login
      </ULink>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod';

const show = ref(false);
const isLoading = ref(false);
const toast = useToast();

const schema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters long'),
  username: z.string()
    .min(1, 'Username is required')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .refine((val) => !/\s/.test(val), 'Username cannot contain spaces')
    .refine((val) => !/^[_-]/.test(val), 'Username cannot start with underscore or hyphen')
    .refine((val) => !/[_-]$/.test(val), 'Username cannot end with underscore or hyphen'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).superRefine((data: {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  }
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  username: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined
})

async function onSubmit() {
  isLoading.value = true;
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Registration failed:', error);
    toast.add({
      title: 'Registration Failed',
      description: 'An error occurred while registering. Please try again.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
    navigateTo('/login')
  }
}
</script>

<style scoped></style>