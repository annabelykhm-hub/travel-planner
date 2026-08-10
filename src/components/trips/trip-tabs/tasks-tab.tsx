"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { TripTask } from "@/lib/types";
import { createTask, deleteTask, toggleTask } from "@/lib/actions/tasks";
import { cn } from "@/lib/utils";

export function TasksTab({ tripId, tasks }: { tripId: string; tasks: TripTask[] }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!title.trim()) return;
    startTransition(async () => {
      await createTask(tripId, title.trim(), dueDate || null);
      setTitle("");
      setDueDate("");
    });
  }

  const sorted = [...tasks].sort((a, b) => Number(a.is_done) - Number(b.is_done));

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          <Input
            placeholder="Add a task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 min-w-[160px]"
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-40"
          />
          <Button onClick={handleAdd} disabled={isPending} size="sm">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardContent>
      </Card>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks yet.</p>
      ) : (
        <div className="space-y-1">
          {sorted.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent/50">
              <Checkbox
                checked={t.is_done}
                onCheckedChange={(checked) =>
                  startTransition(() => toggleTask(t.id, tripId, checked === true))
                }
              />
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm", t.is_done && "text-muted-foreground line-through")}>
                  {t.title}
                </p>
                {t.due_date && <p className="text-xs text-muted-foreground">Due {t.due_date}</p>}
              </div>
              <button
                onClick={() => startTransition(() => deleteTask(t.id, tripId))}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
