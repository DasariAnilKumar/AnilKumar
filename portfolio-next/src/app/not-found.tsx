"use client";

import Link from "next/link";
import LiquidBlob from "./components/LiquidBlob";

export default function NotFound() {
  return (
    <div className="not-found-page">
      {/* Top Branding Header */}
      <header className="not-found-header">
        <Link href="/" className="not-found-brand">
          ANIL KUMAR
        </Link>
      </header>

      {/* Main 404 Centerpiece */}
      <main className="not-found-main">
        <div className="not-found-centerpiece">
          <span className="not-found-digit">4</span>
          <div className="not-found-blob-wrap">
            <LiquidBlob />
          </div>
          <span className="not-found-digit">4</span>
        </div>

        {/* Action Button */}
        <div className="not-found-actions">
          <Link href="/" className="not-found-pill-btn">
            <span>RETURN HOME</span>
          </Link>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="not-found-footer">
        <span>©2026 DASARI ANIL KUMAR. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
}
