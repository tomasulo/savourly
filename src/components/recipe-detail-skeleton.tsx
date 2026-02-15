import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RecipeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Skeleton */}
      <div className="h-[300px] w-full bg-muted animate-pulse" />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Quick Facts Bar Skeleton */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                  <div className="h-5 flex-1 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
