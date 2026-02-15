import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRecipes } from "@/db/queries";
import { RecipeCard } from "@/components/recipe-card";

export default async function LandingPage() {
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");

  // Get 4 most recent recipes for preview
  const recentRecipes = getRecipes().slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-warm-50 to-primary/5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNWYzZjAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCAxMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in duration-700">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
              {t("title")}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/recipes/new">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  {t("addFirstRecipe")} →
                </Button>
              </Link>

              <Link href="/recipes">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 hover:border-primary hover:text-primary transition-all duration-200"
                >
                  {t("browseRecipes")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Savourly?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center space-y-4 group">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-200">
                📚
              </div>
              <h3 className="text-2xl font-semibold">Organize</h3>
              <p className="text-muted-foreground leading-relaxed">
                Keep all your recipes in one beautiful place. Never lose that family recipe again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center space-y-4 group">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-200">
                🔍
              </div>
              <h3 className="text-2xl font-semibold">Discover</h3>
              <p className="text-muted-foreground leading-relaxed">
                Search by cuisine, difficulty, time, and more. Find the perfect recipe instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center space-y-4 group">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-200">
                👨‍🍳
              </div>
              <h3 className="text-2xl font-semibold">Cook</h3>
              <p className="text-muted-foreground leading-relaxed">
                Step-by-step guides with adjustable servings. Cook with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Preview Section */}
      {recentRecipes.length > 0 && (
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Popular Recipes
              </h2>
              <p className="text-xl text-muted-foreground">
                Get inspired by delicious recipes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {recentRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/recipes">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Explore All Recipes →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to start cooking?
          </h2>

          <p className="text-xl text-muted-foreground">
            Join Savourly and organize your recipes beautifully
          </p>

          <Link href="/recipes/new">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {t("addFirstRecipe")} →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
