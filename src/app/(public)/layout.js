import { Navbar } from "@/components/shared/Navbar";
import { ConditionalFooter } from "@/components/shared/ConditionalFooter";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <ConditionalFooter />
    </div>
  );
}
