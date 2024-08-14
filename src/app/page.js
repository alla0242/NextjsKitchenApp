"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello World</h1>
      <div>
        <Link href="/FoH">
          <button className="large-button">Go to FoH</button>
        </Link>
        <Link href="/BoH">
          <button className="large-button">Go to BoH</button>
        </Link>
        <Link href="/axios">
          <button className="large-button">Go to Test</button>
        </Link>
      </div>
    </main>
  );
}