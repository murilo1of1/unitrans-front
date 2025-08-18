import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Provider>
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  )
}