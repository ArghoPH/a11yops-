import Link from "next/link";
import { ArrowLeft, Activity, Plus } from "lucide-react";

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
    projects: {
        name: string;
        website_url: string;
    } | null;
};

function getScoreLabel(score: number) {
    if (score >= 90) return "Good";
    if (score >= 70) return "Needs work";
    return "Poor";
}

function getScoreVariant(score: number) {
    if (score >= 90) return "secondary";
    if (score >= 70) return "outline";
    return "destructive";
}

export default async function ScansPage() {
    const { data: scans } = await supabase
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
        .order("created_at", { ascending: false });

    return (
        <main className="min-h-screen bg-muted/30 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Button variant="ghost" size="sm" asChild className="mb-3">
                            <Link href="/dashboard">
                                <ArrowLeft className="mr-2 size-4" />
                                Back to dashboard
                            </Link>
                        </Button>

                        <h1 className="text-2xl font-semibold tracking-tight">Scans</h1>
                        <p className="text-sm text-muted-foreground">
                            View accessibility scan history and audit scores.
                        </p>
                    </div>

                    <Button>
                        <Plus className="mr-2 size-4" />
                        New Scan
                    </Button>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Activity className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Scan history</CardTitle>
                                <CardDescription>
                                    Scan data is loaded from Supabase. Finally, a table doing
                                    actual work instead of pretending.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Website</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {(scans as Scan[] | null)?.map((scan) => (
                                    <TableRow key={scan.id}>
                                        <TableCell className="font-medium">
                                            {scan.projects?.name ?? "Unknown project"}
                                        </TableCell>

                                        <TableCell>
                                            {scan.projects?.website_url ?? "-"}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{scan.score}/100</span>
                                                <Badge variant={getScoreVariant(scan.score)}>
                                                    {getScoreLabel(scan.score)}
                                                </Badge>
                                            </div>
                                        </TableCell>

                                        <TableCell className="capitalize">{scan.status}</TableCell>

                                        <TableCell>
                                            {new Date(scan.created_at).toLocaleDateString()}
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