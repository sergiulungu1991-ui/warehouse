import { Suspense } from 'react';
import { LoginForm } from './login-form';

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Warehouse
        </h1>
        <p className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to continue
        </p>

        <div className="mt-6">
          <Suspense fallback={<p className="text-center text-sm text-zinc-500">Loading...</p>}>
            <LoginForm next={next} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
