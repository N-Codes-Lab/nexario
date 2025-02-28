import "./globals.css";
import "animate.css";
import "antd/dist/reset.css";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#346af7" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
