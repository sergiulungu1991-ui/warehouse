import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { DetailRow } from '@/components/ui/detail-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate } from '@/components/admin/rentals/rental-utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Users' };

export default async function UsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageContainer narrow>
      <PageHeader
        title="Users"
        description="Accounts are provisioned from the Supabase dashboard"
      />

      {user ? (
        <Card>
          <CardHeader
            title="Signed in account"
            actions={<StatusBadge tone="success">Active</StatusBadge>}
          />
          <div>
            <DetailRow label="Email">{user.email ?? '—'}</DetailRow>
            <DetailRow label="User ID">
              <span className="break-all font-mono text-[11px]">{user.id}</span>
            </DetailRow>
            <DetailRow label="Provider">{user.app_metadata?.provider ?? '—'}</DetailRow>
            <DetailRow label="Created at">{formatDate(user.created_at) ?? '—'}</DetailRow>
            <DetailRow label="Last sign in">{formatDate(user.last_sign_in_at) ?? '—'}</DetailRow>
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState icon={Users} title="No session" description="You are not signed in." />
        </Card>
      )}

      <Card className="mt-3">
        <CardHeader title="Managing users" />
        <CardBody>
          <p className="text-xs leading-relaxed text-fg-muted">
            Listing and inviting other users requires the Supabase service role key, which must
            never reach the browser. Create and disable accounts in{' '}
            <span className="font-mono text-fg">Authentication &rarr; Users</span> inside the
            Supabase dashboard, or add a server-side admin route later.
          </p>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
