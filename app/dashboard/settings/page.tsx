import Link from "next/link";
import { ArrowLeft, Bell, Building2, KeyRound, Settings } from "lucide-react";

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

export default function SettingsPage() {
    return (
        <main className="min-h-screen bg-muted/30 p-6">
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-3">
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to dashboard
                        </Link>
                    </Button>

                    <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage workspace, account, and audit preferences.
                    </p>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Building2 className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Workspace settings</CardTitle>
                                <CardDescription>
                                    Basic workspace information for your audit dashboard.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="workspaceName">Workspace name</Label>
                            <Input id="workspaceName" defaultValue="A11yOps Demo Workspace" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="defaultUrl">Default website URL</Label>
                            <Input id="defaultUrl" defaultValue="https://example.com" />
                        </div>

                        <Button disabled>Save changes</Button>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                                    <Bell className="size-5" />
                                </div>

                                <div>
                                    <CardTitle>Notifications</CardTitle>
                                    <CardDescription>
                                        Configure scan and report alerts.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>Scan completed notification</p>
                            <p>Critical issue alert</p>
                            <p>Weekly accessibility summary</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                                    <KeyRound className="size-5" />
                                </div>

                                <div>
                                    <CardTitle>API & access</CardTitle>
                                    <CardDescription>
                                        Manage keys and integrations later.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>Supabase connected</p>
                            <p>Scanner API pending</p>
                            <p>Report export pending</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                <Settings className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Audit preferences</CardTitle>
                                <CardDescription>
                                    These settings will control future accessibility scans.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border bg-background p-4">
                            <p className="font-medium">WCAG version</p>
                            <p className="mt-1 text-sm text-muted-foreground">WCAG 2.2</p>
                        </div>

                        <div className="rounded-2xl border bg-background p-4">
                            <p className="font-medium">Scan depth</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Single page MVP
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-background p-4">
                            <p className="font-medium">Report format</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                PDF export later
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}