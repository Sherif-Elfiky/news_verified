export const metadata = {
  title: 'News Verified',
  description: 'AI-powered news verification',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
