// RootLayout.js
"use client";
import "./globals.css";
import { metadata } from "./metadata";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="viewport" content={metadata.viewport} />
        <meta name="robots" content={metadata.robots} />
        <link rel="icon" href={metadata.icons.icon} type="image/x-icon" />
        <meta name="theme-color" content={metadata.themeColor} />
      </head>
      <body className="bg-background-primary dark:bg-black">
        {children}
      </body>
    </html>
  );
}