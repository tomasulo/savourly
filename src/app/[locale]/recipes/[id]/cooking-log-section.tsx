"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Plus, Pencil, Trash2 } from "lucide-react";
import type { CookingLog } from "@/lib/types";
import {
  addCookingLogAction,
  updateCookingLogAction,
  deleteCookingLogAction,
} from "./actions";

interface CookingLogSectionProps {
  recipeId: number;
  cookingLogs: CookingLog[];
  currentUserId: string | null;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < (hovered || value);
        return (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1} star`}
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
          >
            <Star
              size={22}
              className={filled ? "text-yellow-500" : "text-gray-300"}
              fill={filled ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function LogForm({
  initialDate,
  initialRating,
  initialNotes,
  onSave,
  onCancel,
  isPending,
}: {
  initialDate: string;
  initialRating: number;
  initialNotes: string;
  onSave: (date: string, rating: number, notes: string) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const t = useTranslations("recipe");
  const tCommon = useTranslations("common");
  const [date, setDate] = useState(initialDate);
  const [rating, setRating] = useState(initialRating);
  const [notes, setNotes] = useState(initialNotes);

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("cookedOn")}</label>
          <input
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("rating")}</label>
          <StarRating value={rating} onChange={setRating} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("notes")}</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("notesPlaceholder")}
          rows={3}
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={isPending || !date}
          onClick={() => onSave(date, rating, notes)}
        >
          {tCommon("save")}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          {tCommon("cancel")}
        </Button>
      </div>
    </div>
  );
}

export function CookingLogSection({
  recipeId,
  cookingLogs: initialLogs,
  currentUserId,
}: CookingLogSectionProps) {
  const t = useTranslations("recipe");
  const tCommon = useTranslations("common");
  const tEmpty = useTranslations("empty");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<number | null>(null);

  const logs = initialLogs;
  const isAuthenticated = currentUserId !== null;

  const totalCooked = logs.length;
  const ratingsWithValue = logs.filter((l) => l.rating !== null);
  const avgRating =
    ratingsWithValue.length > 0
      ? (
          ratingsWithValue.reduce((sum, l) => sum + (l.rating ?? 0), 0) /
          ratingsWithValue.length
        ).toFixed(1)
      : null;

  function handleAdd(date: string, rating: number, notes: string) {
    startTransition(async () => {
      await addCookingLogAction(
        recipeId,
        date,
        rating > 0 ? rating : null,
        notes.trim() || null
      );
      setShowAddForm(false);
    });
  }

  function handleUpdate(
    logId: number,
    date: string,
    rating: number,
    notes: string
  ) {
    startTransition(async () => {
      await updateCookingLogAction(
        logId,
        recipeId,
        date,
        rating > 0 ? rating : null,
        notes.trim() || null
      );
      setEditingLogId(null);
    });
  }

  function handleDelete(logId: number) {
    startTransition(async () => {
      await deleteCookingLogAction(logId, recipeId);
      setDeletingLogId(null);
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl">{t("cookingLog")}</CardTitle>
            {totalCooked > 0 && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{t("timesCooked", { count: totalCooked })}</span>
                {avgRating && (
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    {t("averageRating", { rating: avgRating })}
                  </span>
                )}
              </div>
            )}
          </div>
          {isAuthenticated && !showAddForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5"
            >
              <Plus size={15} />
              {t("logACook")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={`space-y-4 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
        {showAddForm && (
          <LogForm
            initialDate={today()}
            initialRating={0}
            initialNotes=""
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
            isPending={isPending}
          />
        )}

        {logs.length === 0 && !showAddForm && (
          <div className="py-6 text-center text-muted-foreground">
            <p className="font-medium">{tEmpty("noCookingLogs")}</p>
            <p className="mt-1 text-sm">{tEmpty("noCookingLogsDescription")}</p>
          </div>
        )}

        {logs.map((log) => {
          const isOwn = log.user_id === currentUserId;
          const isEditing = editingLogId === log.id;
          const isConfirmingDelete = deletingLogId === log.id;

          return (
            <div key={log.id}>
              {isEditing ? (
                <LogForm
                  initialDate={log.cooked_at.split("T")[0]}
                  initialRating={log.rating ?? 0}
                  initialNotes={log.notes ?? ""}
                  onSave={(date, rating, notes) =>
                    handleUpdate(log.id, date, rating, notes)
                  }
                  onCancel={() => setEditingLogId(null)}
                  isPending={isPending}
                />
              ) : (
                <div className="border-l-2 border-primary pl-4 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.cooked_at).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      {log.rating !== null && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < (log.rating ?? 0)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }
                              fill={
                                i < (log.rating ?? 0) ? "currentColor" : "none"
                              }
                            />
                          ))}
                        </div>
                      )}
                      {log.notes && (
                        <p className="text-sm text-foreground/80 break-words">
                          {log.notes}
                        </p>
                      )}
                    </div>
                    {isOwn && (
                      <div className="flex items-center gap-1 shrink-0">
                        {isConfirmingDelete ? (
                          <>
                            <span className="text-xs text-muted-foreground mr-1">
                              {t("confirmDeleteLog")}
                            </span>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isPending}
                              onClick={() => handleDelete(log.id)}
                            >
                              {tCommon("delete")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeletingLogId(null)}
                            >
                              {tCommon("cancel")}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => setEditingLogId(log.id)}
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setDeletingLogId(log.id)}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
