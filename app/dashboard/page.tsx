import Link from "next/link";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    FileText,
    Globe,
    LayoutDashboard,
    Plus,
    Settings,
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

type Issue = {
    id: string;
    title: string;
    page_url: string | null;
    severity: "critical" | "serious" | "moderate" | "minor";
    status: "open" | "in_progress" | "fixed" | "ignored";
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
    return "secondary";
}

export default async function DashboardPage() {
    const { count: projectCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });

    const { count: criticalCount } = await supabase
        .from("issues")
        .select("*", { count: "exact", head: true })
        .eq("severity", "critical");

    const { count: fixedCount } = await supabase
        .from("issues")
        .select("*", { count: "exact", head: true })
        .eq("status", "fixed");

    const { data: latestScan } = await supabase
        .from("scans")
        .select("score")
        .order("created_at", { ascending: false })
        .limit(1);

    const { data: issues } = await supabase
        .from("issues")
        .select("id, title, page_url, severity, status")
        .order("created_at", { ascending: false })
        .limit(8);

    const score = latestScan?.[0]?.score ?? 0;

    const overviewCards = [
        {
            title: "Projects",
            value: String(projectCount ?? 0).padStart(2, "0"),
            description: "Active website audits",
            icon: Globe,
        },
        {
            title: "Critical Issues",
            value: String(criticalCount ?? 0).padStart(2, "0"),
            description: "Need urgent attention",
            icon: AlertTriangle,
        },
        {
            title: "Fixed Issues",
            value: String(fixedCount ?? 0).padStart(2, "0"),
            description: "Resolved issues",
            icon: CheckCircle2,
        },
        {
            title: "Reports",
            value: "00",
            description: "Generated for clients",
            icon: FileText,
        },
    ];

    return (
        <main className="min-h-screen bg-muted/30">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                <aside className="hidden border-r bg-background lg:block">
                    <div className="flex h-16 items-center border-b px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                A
                            </div>
                            <span>A11yOps</span>
                        </Link>
                    </div>

                    <nav className="space-y-1 p-4">
                        {[
                            { label: "Overview", icon: LayoutDashboard },
                            { label: "Projects", icon: Globe },
                            { label: "Scans", icon: Activity },
                            { label: "Reports", icon: FileText },
                            { label: "Settings", icon: Settings },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.label}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <Icon className="size-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                <section>
                    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
                        <div>
                            <h1 className="text-lg font-semibold">Dashboard</h1>
                            <p className="text-sm text-muted-foreground">
                                Accessibility audit overview
                            </p>
                        </div>

                        <Button>
                            <Plus className="mr-2 size-4" />
                            New Scan
                        </Button>
                    </header>

                    <div className="space-y-6 p-6">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {overviewCards.map((card) => {
                                const Icon = card.icon;

                                return (
                                    <Card key={card.title} className="rounded-2xl">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                            <CardTitle className="text-sm font-medium">
                                                {card.title}
                                            </CardTitle>
                                            <Icon className="size-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-3xl font-semibold">{card.value}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {card.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Latest issues</CardTitle>
                                    <CardDescription>
                                        Data is coming from Supabase now. Tiny miracle.
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
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {(issues as Issue[] | null)?.map((issue) => (
                                                <TableRow key={issue.id}>
                                                    <TableCell className="font-medium">
                                                        {issue.title}
                                                    </TableCell>
                                                    <TableCell>{issue.page_url ?? "-"}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getSeverityVariant(issue.severity)}>
                                                            {formatSeverity(issue.severity)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{formatStatus(issue.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Current audit score</CardTitle>
                                    <CardDescription>
                                        Latest scan score from Supabase.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-5xl font-semibold">{score}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                out of 100
                                            </p>
                                        </div>

                                        <Badge>{score >= 90 ? "Good" : "Needs work"}</Badge>
                                    </div>

                                    <div className="mt-6 h-3 rounded-full bg-muted">
                                        <div
                                            className="h-3 rounded-full bg-primary"
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>

                                    <div className="mt-6 space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Critical</span>
                                            <span>{criticalCount ?? 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Fixed</span>
                                            <span>{fixedCount ?? 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Projects</span>
                                            <span>{projectCount ?? 0}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}