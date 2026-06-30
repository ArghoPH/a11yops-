"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, ArrowLeft, Loader2, Play } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Project = {
    id: string;
    name: string;
    website_url: string;
};

export default function NewScanPage() {
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [projectId, setProjectId] = useState("");
    const [error, setError] = useState("");
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadProjects() {
            const { data, error: projectsError } = await supabase
                .from("projects")
                .select("id, name, website_url")
                .order("created_at", { ascending: false });

            if (projectsError) {
                setError(projectsError.message);
                setIsLoadingProjects(false);
                return;
            }

            setProjects((data as Project[]) ?? []);
            setProjectId(data?.[0]?.id ?? "");
            setIsLoadingProjects(false);
        }

        loadProjects();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");

        if (!projectId) {
            setError("Please select a project.");
            return;
        }

        setIsSubmitting(true);

        const response = await fetch("/api/scans", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                projectId,
            }),
        });

        const result = await response.json();

        setIsSubmitting(false);

        if (!response.ok) {
            setError(result.error ?? "Failed to run scan.");
            return;
        }

        router.push("/dashboard/scans");
        router.refresh();
    }

    return (
        <main className="min-h-screen bg-muted/30 p-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-3">
                        <Link href="/dashboard/scans">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to scans
                        </Link>
                    </Button>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        Run New Scan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Select a project and run a demo accessibility scan through the API
                        route.
                    </p>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Activity className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Scan details</CardTitle>
                                <CardDescription>
                                    This demo flow calls <span className="font-mono">/api/scans</span>,
                                    creates a scan, and inserts accessibility issues into Supabase.
                                    The automated scanner engine will be added in the next phase.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="project">Project</Label>

                                <select
                                    id="project"
                                    value={projectId}
                                    onChange={(event) => setProjectId(event.target.value)}
                                    disabled={isLoadingProjects}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    {isLoadingProjects ? (
                                        <option>Loading projects...</option>
                                    ) : projects.length === 0 ? (
                                        <option>No projects found</option>
                                    ) : (
                                        projects.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name} — {project.website_url}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {error ? (
                                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    {error}
                                </div>
                            ) : null}

                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting || isLoadingProjects || projects.length === 0
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Running scan...
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-2 size-4" />
                                        Run Demo Scan
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