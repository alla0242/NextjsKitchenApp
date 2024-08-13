import Image from "next/image";
import Link from "next/link";
import FoH from "./FoH/page.js";

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
      </div>
    </main>
  );
}