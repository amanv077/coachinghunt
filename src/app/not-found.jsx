import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <Card className="max-w-md text-center">
        <p className="text-5xl font-bold text-secondary">404</p>
        <h1 className="mt-3 text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/search" className="w-full sm:w-auto">
            <Button className="min-h-11 w-full">Find coachings</Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="min-h-11 w-full">
              Go home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
