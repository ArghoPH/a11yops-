import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Globe,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Scan = {
    id: string;
    score: number;
    status: string;
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

type Issue = {
    id: string;
    title: string;
    severity: "critical" | "serious" | "moderate" | "minor";
    status: "open" | "in_progress" | "fixed" | "ignored";
    page_url: string | null;
    wcag_reference: string | null;
};

type ScanDetailPageProps = {
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

function getScoreLabel(score: number) {
    if (score >= 90) return "Good";
    if (score >= 70) return "Needs work";
    return "Poor";
}

export default async function ScanDetailPage({ params }: ScanDetailPageProps) {
    const { id } = await params;

    const { data: scan } = await supabase
        .from("scans")
        .select(
            `
      id,
      score,
      status,
      created_at,
      projects (
        name,
        website_url
      )
    `
        )
        .eq("id", id)
        .single();

    if (!scan) {
        notFound();
    }

    const scanData = scan as Scan;

    const project = Array.isArray(scanData.projects)
        ? scanData.projects[0]
        : scanData.projects;

    const { data: issues } = await supabase
        .from("issues")
        .select("id, title, severity, status, page_url, wcag_reference")
        .eq("scan_id", scanData.id)
        .order("created_at", { ascending: false });

    const issueList = (issues as Issue[] | null) ?? [];

    const criticalCount = issueList.filter(
        (issue) => issue.severity === "critical"
    ).length;

    const fixedCount = issueList.filter((issue) => issue.status === "fixed")
        .length;

    return (
        <main className="min-h-screen bg-muted/30 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-3">
                        <Link href="/dashboard/scans">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to scans
                        </Link>
                    </Button>

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Scan Details
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Review scan score, project info, and detected accessibility
                                issues.
                            </p>
                        </div>

                        <Badge>{getScoreLabel(scanData.score)}</Badge>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                                    <Activity className="size-5" />
                                </div>

                                <div>
                                    <CardTitle>Score</CardTitle>
                                    <CardDescription>Latest audit result</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-5xl font-semibold">{scanData.score}</p>
                            <p className="mt-1 text-sm text-muted-foreground">out of 100</p>

                            <div className="mt-5 h-3 rounded-full bg-muted">
                                <div
                                    className="h-3 rounded-full bg-primary"
                                    style={{ width: `${scanData.score}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                                    <AlertTriangle className="size-5" />
                                </div>

                                <div>
                                    <CardTitle>Critical issues</CardTitle>
                                    <CardDescription>Highest priority problems</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-5xl font-semibold">{criticalCount}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                need attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                                    <CheckCircle2 className="size-5" />
                                </div>

                                <div>
                                    <CardTitle>Fixed issues</CardTitle>
                                    <CardDescription>Resolved from this scan</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-5xl font-semibold">{fixedCount}</p>
                            <p className="mt-1 text-sm text-muted-foreground">completed</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Globe className="size-5" />
                            </div>

                            <div>
                                <CardTitle>{project?.name ?? "Unknown project"}</CardTitle>
                                <CardDescription>
                                    {project?.website_url ?? "No website URL available"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border bg-background p-4">
                            <p className="text-sm text-muted-foreground">Scan status</p>
                            <p className="mt-2 font-medium capitalize">{scanData.status}</p>
                        </div>

                        <div className="rounded-2xl border bg-background p-4">
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="mt-2 font-medium">
                                {new Date(scanData.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-background p-4">
                            <p className="text-sm text-muted-foreground">Total issues</p>
                            <p className="mt-2 font-medium">{issueList.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>Issues from this scan</CardTitle>
                        <CardDescription>
                            Accessibility issues generated for this scan, filtered by scan ID.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Page</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>WCAG</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {issueList.map((issue) => (
                                    <TableRow key={issue.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/dashboard/issues/${issue.id}`}
                                                className="hover:underline"
                                            >
                                                {issue.title}
                                            </Link>
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