import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8 px-6 py-32 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
        <div className="flex gap-4">
          <Link href="/recipes/new">
            <Button size="lg">{t("addFirstRecipe")}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
