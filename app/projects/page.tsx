import React from 'react';
import Link from 'next/link';

export default function DocsHomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Documentation Home</h1>
      <p className="mb-4">
        Welcome to the documentation. Here are some key sections:
      </p>
      <ul className="list-disc pl-5">
        <li>
          <Link
            href="/docs/introduction"
            className="text-blue-600 hover:underline"
          >
            Introduction
          </Link>
        </li>
        <li>
          <Link
            href="/docs/getting-started"
            className="text-blue-600 hover:underline"
          >
            Getting Started
          </Link>
        </li>
        <li>
          <Link href="/docs/features" className="text-blue-600 hover:underline">
            Features
          </Link>
        </li>
        <li>
          <Link
            href="/docs/api-reference"
            className="text-blue-600 hover:underline"
          >
            API Reference
          </Link>
        </li>
      </ul>
    </div>
  );
}
