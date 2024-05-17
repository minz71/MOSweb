"use client";
import Describe from "./describe";
import Footer from "./components/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Describe />
      </div>
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </main>
  );
}
