import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";

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

type Scan = {
    id: string;
    score: number;
    status: string;
    created_at: string;
    projects: {
        name: string;
        website_url: string;
    } | null;
};

type Issue = {
    id: string;
    severity: "critical" | "serious" | "moderate" | "minor";
    status: "open" | "in_progress" | "fixed" | "ignored";
};

function getScoreLabel(score: number) {
    if (score >= 90) return "Good";
    if (score >= 70) return "Needs work";
    return "Poor";
}

export default async function ReportsPage() {
    const { data: latestScan } = await supabase
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
        .order("created_at", { ascending: false })
        .limit(1);

    const scan = (latestScan as Scan[] | null)?.[0];

    const { data: issues } = await supabase
        .from("issues")
        .select("id, severity, status");

    const issueList = (issues as Issue[] | null) ?? [];

    const criticalCount = issueList.filter(
        (issue) => issue.severity === "critical"
    ).length;

    const seriousCount = issueList.filter(
        (issue) => issue.severity === "serious"
    ).length;

    const moderateCount = issueList.filter(
        (issue) => issue.severity === "moderate"
    ).length;

    const fixedCount = issueList.filter((issue) => issue.status === "fixed")
        .length;

    const openCount = issueList.filter((issue) => issue.status === "open").length;

    return (
        <main className="min-h-screen bg-muted/30 p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Button variant="ghost" size="sm" asChild className="mb-3">
                            <Link href="/dashboard">
                                <ArrowLeft className="mr-2 size-4" />
                                Back to dashboard
                            </Link>
                        </Button>

                        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
                        <p className="text-sm text-muted-foreground">
                            Generate client-ready accessibility audit summaries.
                        </p>
                    </div>

                    <Button disabled>
                        <Download className="mr-2 size-4" />
                        Export PDF
                    </Button>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <FileText className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Latest audit report</CardTitle>
                                <CardDescription>
                                    This summary is generated from Supabase scan and issue data.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        <div className="rounded-2xl border bg-background p-6">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">Project</p>
                                    <h2 className="mt-1 text-2xl font-semibold">
                                        {scan?.projects?.name ?? "No scan found"}
                                    </h2>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {scan?.projects?.website_url ?? "No website URL available"}
                                    </p>
                                </div>

                                <div className="text-left md:text-right">
                                    <Badge>{scan ? getScoreLabel(scan.score) : "No data"}</Badge>
                                    <p className="mt-3 text-5xl font-semibold">
                                        {scan?.score ?? 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">out of 100</p>
                                </div>
                            </div>

                            <div className="mt-6 h-3 rounded-full bg-muted">
                                <div
                                    className="h-3 rounded-full bg-primary"
                                    style={{ width: `${scan?.score ?? 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="rounded-2xl border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Critical</p>
                                <p className="mt-2 text-3xl font-semibold">{criticalCount}</p>
                            </div>

                            <div className="rounded-2xl border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Serious</p>
                                <p className="mt-2 text-3xl font-semibold">{seriousCount}</p>
                            </div>

                            <div className="rounded-2xl border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Moderate</p>
                                <p className="mt-2 text-3xl font-semibold">{moderateCount}</p>
                            </div>

                            <div className="rounded-2xl border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Open</p>
                                <p className="mt-2 text-3xl font-semibold">{openCount}</p>
                            </div>

                            <div className="rounded-2xl border bg-background p-4">
                                <p className="text-sm text-muted-foreground">Fixed</p>
                                <p className="mt-2 text-3xl font-semibold">{fixedCount}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-background p-6">
                            <h3 className="text-lg font-semibold">Executive summary</h3>
                            <p className="mt-3 leading-7 text-muted-foreground">
                                This website currently has an accessibility score of{" "}
                                <span className="font-medium text-foreground">
                                    {scan?.score ?? 0}/100
                                </span>
                                . The audit found{" "}
                                <span className="font-medium text-foreground">
                                    {criticalCount}
                                </span>{" "}
                                critical issue(s),{" "}
                                <span className="font-medium text-foreground">
                                    {seriousCount}
                                </span>{" "}
                                serious issue(s), and{" "}
                                <span className="font-medium text-foreground">
                                    {moderateCount}
                                </span>{" "}
                                moderate issue(s). Priority should be given to critical issues
                                first, especially problems that block screen readers, keyboard
                                navigation, form usage, or clear visual readability.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}