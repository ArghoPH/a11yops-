import { load } from "cheerio";
import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/client";

type ScanRequestBody = {
    projectId?: string;
};

type IssueSeverity = "critical" | "serious" | "moderate" | "minor";

type DetectedIssue = {
    title: string;
    description: string;
    severity: IssueSeverity;
    status: "open";
    page_url: string;
    wcag_reference: string;
    element_selector: string;
    suggested_fix: string;
};

function getPagePath(url: string) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname || "/";
    } catch {
        return "/";
    }
}

function createSelector(tagName: string, index: number, id?: string, className?: string) {
    if (id) {
        return `${tagName}#${id}`;
    }

    if (className) {
        const firstClass = className.split(" ").filter(Boolean)[0];

        if (firstClass) {
            return `${tagName}.${firstClass}`;
        }
    }

    return `${tagName}:nth-of-type(${index + 1})`;
}

function calculateScore(issues: DetectedIssue[]) {
    let score = 100;

    for (const issue of issues) {
        if (issue.severity === "critical") score -= 12;
        if (issue.severity === "serious") score -= 8;
        if (issue.severity === "moderate") score -= 5;
        if (issue.severity === "minor") score -= 2;
    }

    return Math.max(score, 0);
}

function scanHtml(html: string, pageUrl: string): DetectedIssue[] {
    const $ = load(html);
    const issues: DetectedIssue[] = [];
    const pagePath = getPagePath(pageUrl);

    const htmlLang = $("html").attr("lang");

    if (!htmlLang || htmlLang.trim().length === 0) {
        issues.push({
            title: "HTML document is missing a language attribute",
            description:
                "The html element does not define a lang attribute, so assistive technologies may not identify the page language correctly.",
            severity: "serious",
            status: "open",
            page_url: pagePath,
            wcag_reference: "WCAG 2.2 - 3.1.1 Language of Page",
            element_selector: "html",
            suggested_fix:
                'Add a language attribute to the html tag, for example: <html lang="en">.',
        });
    }

    const pageTitle = $("title").first().text().trim();

    if (!pageTitle) {
        issues.push({
            title: "Page is missing a title",
            description:
                "The page does not provide a meaningful title, which makes navigation harder for screen reader and browser users.",
            severity: "critical",
            status: "open",
            page_url: pagePath,
            wcag_reference: "WCAG 2.2 - 2.4.2 Page Titled",
            element_selector: "title",
            suggested_fix:
                "Add a clear and unique title element that describes the page purpose.",
        });
    }

    if ($("main, [role='main']").length === 0) {
        issues.push({
            title: "Page is missing a main landmark",
            description:
                "The page does not include a main element or role='main', making it harder for assistive technology users to jump to main content.",
            severity: "moderate",
            status: "open",
            page_url: pagePath,
            wcag_reference: "WCAG 2.2 - 1.3.1 Info and Relationships",
            element_selector: "main",
            suggested_fix:
                "Wrap the primary page content inside a <main> element or add role='main' to the main content container.",
        });
    }

    if ($("h1").length === 0) {
        issues.push({
            title: "Page is missing an H1 heading",
            description:
                "The page does not include a top-level heading, which can make the document structure unclear.",
            severity: "moderate",
            status: "open",
            page_url: pagePath,
            wcag_reference: "WCAG 2.2 - 1.3.1 Info and Relationships",
            element_selector: "h1",
            suggested_fix:
                "Add one clear H1 heading that describes the main topic of the page.",
        });
    }

    let previousHeadingLevel = 0;

    $("h1, h2, h3, h4, h5, h6").each((index, element) => {
        const tagName = element.tagName.toLowerCase();
        const currentLevel = Number(tagName.replace("h", ""));

        if (
            previousHeadingLevel > 0 &&
            currentLevel > previousHeadingLevel + 1
        ) {
            issues.push({
                title: "Heading levels are skipped",
                description:
                    `A ${tagName.toUpperCase()} appears after an H${previousHeadingLevel}, which can create a confusing document outline.`,
                severity: "moderate",
                status: "open",
                page_url: pagePath,
                wcag_reference: "WCAG 2.2 - 1.3.1 Info and Relationships",
                element_selector: createSelector(
                    tagName,
                    index,
                    $(element).attr("id"),
                    $(element).attr("class")
                ),
                suggested_fix:
                    "Use heading levels in order. Do not skip from H1 to H3 or H2 to H4 unless the page structure truly requires it.",
            });
        }

        previousHeadingLevel = currentLevel;
    });

    $("img").each((index, element) => {
        const alt = $(element).attr("alt");

        if (alt === undefined) {
            issues.push({
                title: "Image is missing alt text",
                description:
                    "An image does not include an alt attribute, so screen reader users may not understand its purpose.",
                severity: "serious",
                status: "open",
                page_url: pagePath,
                wcag_reference: "WCAG 2.2 - 1.1.1 Non-text Content",
                element_selector: createSelector(
                    "img",
                    index,
                    $(element).attr("id"),
                    $(element).attr("class")
                ),
                suggested_fix:
                    "Add meaningful alt text. If the image is decorative, use alt=\"\".",
            });
        }
    });

    $("button").each((index, element) => {
        const text = $(element).text().trim();
        const ariaLabel = $(element).attr("aria-label")?.trim();
        const title = $(element).attr("title")?.trim();

        if (!text && !ariaLabel && !title) {
            issues.push({
                title: "Button has no accessible name",
                description:
                    "A button does not provide visible text, aria-label, or title, so assistive technology users may not understand the button purpose.",
                severity: "critical",
                status: "open",
                page_url: pagePath,
                wcag_reference: "WCAG 2.2 - 4.1.2 Name, Role, Value",
                element_selector: createSelector(
                    "button",
                    index,
                    $(element).attr("id"),
                    $(element).attr("class")
                ),
                suggested_fix:
                    "Add visible button text or provide a clear aria-label.",
            });
        }
    });

    $("a").each((index, element) => {
        const text = $(element).text().trim();
        const ariaLabel = $(element).attr("aria-label")?.trim();
        const title = $(element).attr("title")?.trim();
        const imageAlt = $(element).find("img").attr("alt")?.trim();

        if (!text && !ariaLabel && !title && !imageAlt) {
            issues.push({
                title: "Link has no accessible name",
                description:
                    "A link does not provide readable text or an accessible label, making its destination unclear.",
                severity: "critical",
                status: "open",
                page_url: pagePath,
                wcag_reference: "WCAG 2.2 - 2.4.4 Link Purpose",
                element_selector: createSelector(
                    "a",
                    index,
                    $(element).attr("id"),
                    $(element).attr("class")
                ),
                suggested_fix:
                    "Add descriptive link text or an aria-label that explains the link destination.",
            });
        }
    });

    $("input, textarea, select").each((index, element) => {
        const tagName = element.tagName.toLowerCase();
        const type = $(element).attr("type");

        if (type === "hidden" || type === "submit" || type === "button") {
            return;
        }

        const id = $(element).attr("id");
        const ariaLabel = $(element).attr("aria-label")?.trim();
        const ariaLabelledBy = $(element).attr("aria-labelledby")?.trim();
        const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;

        if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
            issues.push({
                title: "Form field is missing an accessible label",
                description:
                    "A form field does not have a connected label or accessible name.",
                severity: "critical",
                status: "open",
                page_url: pagePath,
                wcag_reference: "WCAG 2.2 - 3.3.2 Labels or Instructions",
                element_selector: createSelector(
                    tagName,
                    index,
                    $(element).attr("id"),
                    $(element).attr("class")
                ),
                suggested_fix:
                    "Add a visible label connected with htmlFor/id, or provide aria-label or aria-labelledby.",
            });
        }
    });

    return issues;
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

        let websiteUrl: URL;

        try {
            websiteUrl = new URL(project.website_url);
        } catch {
            return NextResponse.json(
                { error: "Project website URL is invalid." },
                { status: 400 }
            );
        }

        const response = await fetch(websiteUrl.toString(), {
            headers: {
                "User-Agent":
                    "A11yOps Accessibility Scanner/1.0 (+https://a11yops.local)",
                Accept: "text/html,application/xhtml+xml",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch website. Status: ${response.status}` },
                { status: 400 }
            );
        }

        const contentType = response.headers.get("content-type") ?? "";

        if (!contentType.includes("text/html")) {
            return NextResponse.json(
                { error: "The provided URL did not return an HTML page." },
                { status: 400 }
            );
        }

        const html = await response.text();
        const detectedIssues = scanHtml(html, websiteUrl.toString());
        const score = calculateScore(detectedIssues);

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

        if (detectedIssues.length > 0) {
            const issuesToInsert = detectedIssues.map((issue) => ({
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
        }

        return NextResponse.json({
            scanId: scan.id,
            score: scan.score,
            issuesFound: detectedIssues.length,
            project: {
                id: project.id,
                name: project.name,
                websiteUrl: project.website_url,
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Something went wrong while running the accessibility scan." },
            { status: 500 }
        );
    }
}