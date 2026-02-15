"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            {t("recipeErrorTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground text-lg">
            {t("recipeErrorDescription")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} size="lg">
              {t("tryAgain")}
            </Button>
            <Link href="/recipes">
              <Button variant="outline" size="lg">
                {t("backToRecipes")}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="lg">
                {t("goHome")}
              </Button>
            </Link>
          </div>

          {error.digest && (
            <p className="text-xs text-muted-foreground mt-6">
              {t("errorId")}: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
