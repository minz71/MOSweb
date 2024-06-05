import AudioRecorder from "./audioRecorder";
import "../globals.css";
import Footer from "../components/footer";

export default function Home() {
  return (
    <main className="min-h-svh flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-24">
        <AudioRecorder />
      </div>
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </main>
  );
}
