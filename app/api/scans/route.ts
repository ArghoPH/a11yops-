import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/client";

type ScanRequestBody = {
    projectId?: string;
};

const demoIssues = [
    {
        title: "Button has no accessible name",
        description:
            "A button element does not provide readable text for screen readers.",
        severity: "critical",
        status: "open",
        page_url: "/pricing",
        wcag_reference: "WCAG 2.2 - 4.1.2 Name, Role, Value",
        element_selector: "button.pricing-cta",
        suggested_fix: "Add visible text or an aria-label to the button.",
    },
    {
        title: "Image missing alt text",
        description: "An image is missing alternative text.",
        severity: "serious",
        status: "open",
        page_url: "/services",
        wcag_reference: "WCAG 2.2 - 1.1.1 Non-text Content",
        element_selector: "img.service-card-image",
        suggested_fix:
            "Add meaningful alt text that describes the image purpose.",
    },
    {
        title: "Low color contrast on CTA",
        description: "Text contrast is too low against the background color.",
        severity: "moderate",
        status: "open",
        page_url: "/",
        wcag_reference: "WCAG 2.2 - 1.4.3 Contrast Minimum",
        element_selector: ".hero-cta",
        suggested_fix:
            "Increase contrast between the text color and background color.",
    },
];

function createScore() {
    const min = 62;
    const max = 88;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ScanRequestBody;

        if (!body.projectId) {
            return NextResponse.json(
                { error: "Project ID is required." },
                { status: 400 }
            );
        }

        const { data: project, error: projectError } = await supabase
            .from("projects")
            .select("id, name, website_url")
            .eq("id", body.projectId)
            .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: "Project not found." },
                { status: 404 }
            );
        }

        const score = createScore();

        const { data: scan, error: scanError } = await supabase
            .from("scans")
            .insert({
                project_id: project.id,
                score,
                status: "completed",
            })
            .select("id, score")
            .single();

        if (scanError || !scan) {
            return NextResponse.json(
                { error: scanError?.message ?? "Failed to create scan." },
                { status: 500 }
            );
        }

        const issuesToInsert = demoIssues.map((issue) => ({
            ...issue,
            project_id: project.id,
            scan_id: scan.id,
        }));

        const { error: issuesError } = await supabase
            .from("issues")
            .insert(issuesToInsert);

        if (issuesError) {
            return NextResponse.json(
                { error: issuesError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            scanId: scan.id,
            score: scan.score,
            project: {
                id: project.id,
                name: project.name,
                websiteUrl: project.website_url,
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Something went wrong while running the scan." },
            { status: 500 }
        );
    }
}