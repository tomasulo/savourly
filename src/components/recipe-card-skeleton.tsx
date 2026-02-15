import { Card, CardContent } from "@/components/ui/card";

export function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="h-48 w-full bg-muted animate-pulse" />

      {/* Content skeleton */}
      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-muted animate-pulse rounded w-3/4" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
        </div>

        {/* Badges skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-muted animate-pulse rounded w-20" />
          <div className="h-6 bg-muted animate-pulse rounded w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function RecipeListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}
