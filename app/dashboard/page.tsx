'use client';

import { DashboardHeader } from '@/components/dashboard-header';
import { ProjectList } from '@/components/project-list';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

export default function DashboardPage() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader user={user!} signOut={signOut!} />
          <ProjectList />
        </div>
      )}
    </Authenticator>
  );
}
