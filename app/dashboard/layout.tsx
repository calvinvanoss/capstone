import { AuthGetCurrentUserServer } from '@/lib/amplify-utils';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await AuthGetCurrentUserServer();
  console.log(user);

  if (!user) {
    redirect('/auth');
  }
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
