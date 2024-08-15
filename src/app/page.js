import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello World</h1>
      <div>
        <Link href="/FoH" className="large-button">
          <button className="large-button">Go to FoH</button>
        </Link>
        <Link href="/BoH" className="large-button">
          <button className="large-button">Go to BoH</button>
        </Link>

      </div>
    </main>
  );
}