'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { FormField, TextInput } from '@/components/ui/form';

type LoginFormProps = {
  next?: string;
};

export function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError || !data.user) {
      setError('Invalid email or password');
      return;
    }

    router.push(next || '/admin/items');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <FormField label="Email" required>
        {(props) => (
          <TextInput
            {...props}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        )}
      </FormField>

      <FormField label="Password" required>
        {(props) => (
          <TextInput
            {...props}
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        )}
      </FormField>

      {error && (
        <p role="alert" className="text-[11px] text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" size="md" loading={loading} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
