import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, Plus } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

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

type Project = {
    id: string;
    name: string;
    website_url: string;
    created_at: string;
};

export default async function ProjectsPage() {
    const { data: projects } = await supabase
        .from("projects")
        .select("id, name, website_url, created_at")
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

                        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage websites that are being audited for accessibility issues.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/dashboard/projects/new">
                            <Plus className="mr-2 size-4" />
                            New Project
                        </Link>
                    </Button>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Globe className="size-5" />
                            </div>
                            <div>
                                <CardTitle>Website projects</CardTitle>
                                <CardDescription>
                                    Project data is loaded from Supabase.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project name</TableHead>
                                    <TableHead>Website URL</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {(projects as Project[] | null)?.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">
                                            {project.name}
                                        </TableCell>

                                        <TableCell>{project.website_url}</TableCell>

                                        <TableCell>
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <a
                                                    href={project.website_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Visit
                                                    <ExternalLink className="ml-2 size-4" />
                                                </a>
                                            </Button>
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