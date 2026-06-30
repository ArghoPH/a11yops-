"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Globe, Loader2, Plus } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewProjectPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");

        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }

        if (!websiteUrl.trim()) {
            setError("Website URL is required.");
            return;
        }

        if (!websiteUrl.startsWith("http://") && !websiteUrl.startsWith("https://")) {
            setError("Website URL must start with http:// or https://");
            return;
        }

        setIsSubmitting(true);

        const { error: insertError } = await supabase.from("projects").insert({
            name: name.trim(),
            website_url: websiteUrl.trim(),
        });

        setIsSubmitting(false);

        if (insertError) {
            setError(insertError.message);
            return;
        }

        router.push("/dashboard/projects");
        router.refresh();
    }

    return (
        <main className="min-h-screen bg-muted/30 p-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-3">
                        <Link href="/dashboard/projects">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to projects
                        </Link>
                    </Button>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create New Project
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Add a website that you want to audit for accessibility issues.
                    </p>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Globe className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Website details</CardTitle>
                                <CardDescription>
                                    This data will be saved in your Supabase projects table.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Project name</Label>
                                <Input
                                    id="name"
                                    placeholder="Example: Client Website Audit"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="websiteUrl">Website URL</Label>
                                <Input
                                    id="websiteUrl"
                                    placeholder="https://example.com"
                                    value={websiteUrl}
                                    onChange={(event) => setWebsiteUrl(event.target.value)}
                                />
                            </div>

                            {error ? (
                                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    {error}
                                </div>
                            ) : null}

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 size-4" />
                                        Create Project
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}