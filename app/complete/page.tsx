import Complete from "./complete";
import Footer from "../components/footer";
import "../globals.css";

export default function Home() {
  return (
    <main className="min-h-svh flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Complete />
      </div>
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </main>
  );
}
