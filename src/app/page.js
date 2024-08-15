import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello World</h1>
      <div>
        <Link href="/FoH" className="">
          <button className="large-button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Go to FoH</button>
        </Link>
        <Link href="/BoH" className="">
          <button className="large-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">Go to BoH</button>
        </Link>

      </div>
    </main>
  );
}