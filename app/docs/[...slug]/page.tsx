import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

async function getDocContent(slug: string[]) {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 100));

  const fullSlug = slug.join('/');

  // This is where you would typically fetch the actual content based on the slug
  const content = `This is the content for ${fullSlug}`;
  const title =
    slug[slug.length - 1].charAt(0).toUpperCase() +
    slug[slug.length - 1].slice(1);

  if (!content) {
    return null;
  }

  return { content, title };
}

export default async function DocPage({
  params,
}: {
  params: { slug: string[] };
}) {
  if (!params.slug || params.slug.length === 0) {
    notFound();
  }

  const docContent = await getDocContent(params.slug);

  if (!docContent) {
    notFound();
  }

  const breadcrumbs = [
    { href: '/docs', label: 'Documentation' },
    ...params.slug.map((part, index) => ({
      href: `/docs/${params.slug.slice(0, index + 1).join('/')}`,
      label: part.charAt(0).toUpperCase() + part.slice(1),
    })),
  ];

  return (
    <div className="p-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <main className="prose max-w-none mt-6">
        <h1>{docContent.title}</h1>
        <p>{docContent.content}</p>
      </main>
    </div>
  );
}
