"use client";

import { useTranslations } from "next-intl";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";
import RecipeForm from "./recipe-form";

export default function NewRecipePage() {
  const t = useTranslations("recipe");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">{tCommon("loading")}</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">{tAuth("loginRequired")}</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("newRecipe")}</h1>
      <RecipeForm />
    </main>
  );
}
