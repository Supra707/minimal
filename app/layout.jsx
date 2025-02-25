import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FocusGate - Minimalist YouTube for Studying",
  description:
    "A distraction-free YouTube experience for focused learning. No ads, no recommendations—just pure content.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative min-h-screen w-full">
          {/* Fixed Background Pattern */}
          <div
            className="fixed inset-0 w-screen h-screen bg-white 
                 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
                 bg-[size:6rem_4rem]"
            style={{
              backgroundRepeat: "repeat",
              backgroundPosition: "0 0",
              backgroundAttachment: "fixed",
            }}
          >
            {/* Radial Gradient Overlay */}
            <div
              className="fixed inset-0 w-full h-full 
                   bg-[radial-gradient(circle_800px_at_50%_200px,#C9EBFF,transparent)]"
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center top",
                backgroundSize: "100% 100%",
                backgroundAttachment: "fixed",
              }}
            />
          </div>

          {/* Scrollable Content */}
          <div className="relative z-10 w-full min-h-screen">{children}</div>
        </div>
      </body>
    </html>
  );
}
