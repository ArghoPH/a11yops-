import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: ShieldCheck,
    title: "Accessibility audits",
    description:
      "Scan websites for accessibility issues like missing labels, poor contrast, broken ARIA, and weak keyboard support.",
  },
  {
    icon: Target,
    title: "Issue tracking",
    description:
      "Organize problems by severity, assign fixes, and track progress from open to resolved.",
  },
  {
    icon: FileText,
    title: "Client-ready reports",
    description:
      "Generate clean audit reports that developers, agencies, and business owners can actually understand.",
  },
];

const stats = [
  { label: "Critical issues", value: "18" },
  { label: "WCAG checks", value: "64" },
  { label: "Fix progress", value: "72%" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              A
            </div>
            <span>A11yOps</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="#workflow" className="hover:text-foreground">
              Workflow
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
          </nav>

          <Button asChild>
            <Link href="/dashboard">
              Open Dashboard
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Badge variant="secondary" className="mb-6">
            Website Accessibility Audit SaaS
          </Badge>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Audit accessibility issues. Track fixes. Ship better websites.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A11yOps helps developers and agencies scan websites, detect WCAG
            issues, manage fixes, and generate professional audit reports from
            one dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Start audit demo
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="#features">View features</Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border p-4">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden rounded-3xl shadow-sm">
          <CardHeader className="border-b bg-muted/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Audit Overview</CardTitle>
                <CardDescription>example-client.com</CardDescription>
              </div>
              <Badge>Score 74/100</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-6">
            <div className="rounded-2xl border p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">Accessibility score</p>
                <p className="text-sm text-muted-foreground">Needs work</p>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div className="h-3 w-[74%] rounded-full bg-primary" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Serious</p>
                </div>
                <p className="mt-3 text-3xl font-semibold">12</p>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Fixed</p>
                </div>
                <p className="mt-3 text-3xl font-semibold">31</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                "Button has no accessible name",
                "Image element missing alt text",
                "Form input missing label",
              ].map((issue) => (
                <div
                  key={issue}
                  className="flex items-center justify-between rounded-2xl border p-4"
                >
                  <div>
                    <p className="font-medium">{issue}</p>
                    <p className="text-sm text-muted-foreground">
                      WCAG 2.2 issue detected
                    </p>
                  </div>
                  <Badge variant="secondary">Open</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="features" className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Built for developers, agencies, and audit workflows.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A commercial-grade portfolio project that shows frontend skill,
              dashboard thinking, backend structure, and real product value.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title} className="rounded-3xl">
                  <CardHeader>
                    <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-6 py-20">
        <Card className="rounded-3xl">
          <CardContent className="grid gap-8 p-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Add website",
                desc: "Create a project and enter the website URL.",
              },
              {
                step: "02",
                title: "Run audit",
                desc: "Detect accessibility problems and group them by severity.",
              },
              {
                step: "03",
                title: "Track fixes",
                desc: "Manage status, assign work, and export reports.",
              },
            ].map((item) => (
              <div key={item.step}>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.step}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}