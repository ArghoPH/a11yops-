import Link from "next/link";
import { notFound } from "next/navigation";
import { IssueStatusSelect } from "@/components/dashboard/issue-status-select";
import {
    AlertTriangle,
    ArrowLeft,
    Code2,
    FileCheck2,
    Globe,
    Lightbulb,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type Issue = {
    id: string;
    title: string;
    description: string | null;
    severity: "critical" | "serious" | "moderate" | "minor";
    status: "open" | "in_progress" | "fixed" | "ignored";
    page_url: string | null;
    wcag_reference: string | null;
    element_selector: string | null;
    suggested_fix: string | null;
    created_at: string;
    projects:
    | {
        name: string;
        website_url: string;
    }
    | {
        name: string;
        website_url: string;
    }[]
    | null;
};

type IssueDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function formatSeverity(severity: Issue["severity"]) {
    return {
        critical: "Critical",
        serious: "Serious",
        moderate: "Moderate",
        minor: "Minor",
    }[severity];
}

function formatStatus(status: Issue["status"]) {
    return {
        open: "Open",
        in_progress: "In Progress",
        fixed: "Fixed",
        ignored: "Ignored",
    }[status];
}

function getSeverityVariant(severity: Issue["severity"]) {
    if (severity === "critical") return "destructive";
    if (severity === "serious") return "secondary";
    return "outline";
}

export default async function IssueDetailPage({
    params,
}: IssueDetailPageProps) {
    const { id } = await params;

    const { data: issue } = await supabase
        .from("issues")
        .select(
            `
      id,
      title,
      description,
      severity,
      status,
      page_url,
      wcag_reference,
      element_selector,
      suggested_fix,
      created_at,
      projects (
        name,
        website_url
      )
    `
        )
        .eq("id", id)
        .single();

    if (!issue) {
        notFound();
    }

    const issueData = issue as Issue;

    const project = Array.isArray(issueData.projects)
        ? issueData.projects[0]
        : issueData.projects;

    return (
        <main className="min-h-screen bg-muted/30 p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-3">
                        <Link href="/dashboard/issues">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to issues
                        </Link>
                    </Button>

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {issueData.title}
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Detailed accessibility issue report and suggested fix.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Badge variant={getSeverityVariant(issueData.severity)}>
                                {formatSeverity(issueData.severity)}
                            </Badge>
                            <Badge variant="outline">{formatStatus(issueData.status)}</Badge>
                        </div>
                    </div>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <AlertTriangle className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Issue summary</CardTitle>
                                <CardDescription>
                                    Main issue information loaded from Supabase.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Description
                            </p>
                            <p className="mt-2 leading-7">
                                {issueData.description ?? "No description available."}
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Severity</p>
                                <p className="mt-2 font-medium">
                                    {formatSeverity(issueData.severity)}
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="mt-2 font-medium">
                                    {formatStatus(issueData.status)}
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Page</p>
                                <p className="mt-2 font-medium">{issueData.page_url ?? "-"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>Update issue status</CardTitle>
                        <CardDescription>
                            Change the workflow status for this accessibility issue.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <IssueStatusSelect
                            issueId={issueData.id}
                            initialStatus={issueData.status}
                        />
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                                    <Globe className="size-5" />
                                </div>

                                <div>
                                    <CardTitle>Project</CardTitle>
                                    <CardDescription>
                                        Website connected to this issue.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <p className="font-medium">
                                {project?.name ?? "Unknown project"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {project?.website_url ?? "No website URL"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                                    <FileCheck2 className="size-5" />
                                </div>

                                <div>
                                    <CardTitle>WCAG reference</CardTitle>
                                    <CardDescription>
                                        Accessibility rule reference.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm leading-7 text-muted-foreground">
                                {issueData.wcag_reference ?? "No WCAG reference available."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Code2 className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Affected element</CardTitle>
                                <CardDescription>
                                    Selector or target element where the issue was detected.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-2xl border bg-background p-4 font-mono text-sm">
                            {issueData.element_selector ?? "No selector available."}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Lightbulb className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Suggested fix</CardTitle>
                                <CardDescription>
                                    Developer-friendly recommendation for fixing this issue.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <p className="leading-7">
                            {issueData.suggested_fix ?? "No suggested fix available."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}