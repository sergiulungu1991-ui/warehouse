import { Suspense } from 'react';
import { Warehouse } from 'lucide-react';
import { LoginForm } from './login-form';

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-100 p-4">
      <div className="w-full max-w-xs rounded-md border border-line bg-surface-200 p-5">
        <div className="mb-5 flex flex-col items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface-300 text-accent">
            <Warehouse className="h-4 w-4" />
          </span>
          <h1 className="text-sm font-semibold text-fg">Warehouse</h1>
          <p className="text-[11px] text-fg-subtle">Sign in to continue</p>
        </div>

        <Suspense fallback={<p className="text-center text-[11px] text-fg-subtle">Loading...</p>}>
          <LoginForm next={next} />
        </Suspense>
      </div>
    </div>
  );
}
