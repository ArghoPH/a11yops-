import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
    projects: {
        name: string;
        website_url: string;
    } | null;
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

export default async function IssuesPage() {
    const { data: issues } = await supabase
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
        .order("created_at", { ascending: false });

    return (
        <main className="min-h-screen bg-muted/30 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-3">
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to dashboard
                        </Link>
                    </Button>

                    <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
                    <p className="text-sm text-muted-foreground">
                        Review detected accessibility problems and suggested fixes.
                    </p>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <AlertTriangle className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Accessibility issues</CardTitle>
                                <CardDescription>
                                    WCAG issue data is loaded from Supabase for review and tracking.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Page</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>WCAG</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {(issues as Issue[] | null)?.map((issue) => (
                                    <TableRow key={issue.id}>
                                        <TableCell className="max-w-[360px]">
                                            <Link
                                                href={`/dashboard/issues/${issue.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {issue.title}
                                            </Link>

                                            <div className="mt-1 text-sm text-muted-foreground">
                                                {issue.suggested_fix ?? issue.description}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {issue.projects?.name ?? "Unknown project"}
                                        </TableCell>

                                        <TableCell>{issue.page_url ?? "-"}</TableCell>

                                        <TableCell>
                                            <Badge variant={getSeverityVariant(issue.severity)}>
                                                {formatSeverity(issue.severity)}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{formatStatus(issue.status)}</TableCell>

                                        <TableCell className="max-w-[220px] text-sm text-muted-foreground">
                                            {issue.wcag_reference ?? "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}