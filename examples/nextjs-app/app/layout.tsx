import type { ReactNode } from "react";
import { AppProviders } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Access Control Kit — Next.js Example",
  description: "RBAC demo using react-access-control-kit",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
