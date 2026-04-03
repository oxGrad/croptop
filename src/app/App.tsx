import React from "react";
import { ProfilePictureCropper } from "./components/ProfilePictureCropper";

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-6xl mx-auto space-y-10 py-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
            Crop Top
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Prepare your logo for social media platforms. Adjust the zoom and
            rotation to get the perfect circular fit, then download your
            high-resolution profile picture.
          </p>
        </header>

        <main className="w-full relative z-10">
          <ProfilePictureCropper />
        </main>

        <footer className="text-center flex flex-col items-center gap-2 mt-16 pt-8 pb-4">
          <p className="text-neutral-400 text-sm font-medium">
            Built for precise 1:1 profile photo cropping
          </p>
        </footer>
      </div>
    </div>
  );
}
