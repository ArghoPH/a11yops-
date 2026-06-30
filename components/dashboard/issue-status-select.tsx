"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type IssueStatus = "open" | "in_progress" | "fixed" | "ignored";

type IssueStatusSelectProps = {
    issueId: string;
    initialStatus: IssueStatus;
};

export function IssueStatusSelect({
    issueId,
    initialStatus,
}: IssueStatusSelectProps) {
    const router = useRouter();

    const [status, setStatus] = useState<IssueStatus>(initialStatus);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setError("");
        setIsSaving(true);

        const { error: updateError } = await supabase
            .from("issues")
            .update({ status })
            .eq("id", issueId);

        setIsSaving(false);

        if (updateError) {
            setError(updateError.message);
            return;
        }

        router.refresh();
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="status">Issue status</Label>

                <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as IssueStatus)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="fixed">Fixed</option>
                    <option value="ignored">Ignored</option>
                </select>
            </div>

            {error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            ) : null}

            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    "Save Status"
                )}
            </Button>
        </div>
    );
}