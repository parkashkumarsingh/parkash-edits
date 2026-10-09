import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { Project, INITIAL_PROJECTS } from "@/components/projects/ProjectsData";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

async function getStoredProjects(): Promise<Project[]> {
  try {
    if (!existsSync(PROJECTS_FILE)) {
      if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
      }
      await writeFile(PROJECTS_FILE, JSON.stringify(INITIAL_PROJECTS, null, 2), "utf8");
      return INITIAL_PROJECTS;
    }
    const raw = await readFile(PROJECTS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading projects:", err);
    return INITIAL_PROJECTS;
  }
}

async function saveStoredProjects(projects: Project[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf8");
}

const CMS_PASSWORD = "parkash@1212";

function isAuthorized(request: NextRequest): boolean {
  return request.headers.get("x-cms-password") === CMS_PASSWORD;
}

export async function GET() {
  const projects = await getStoredProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized: Incorrect or missing CMS password" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const projects = await getStoredProjects();

    const newProject: Project = {
      ...body,
      id: body.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      uploadedAt: new Date().toISOString(),
      techSpecs: body.techSpecs || {
        pipeline: "Custom Pipeline",
        software: [],
        deliverables: [],
      },
      tags: body.tags || [],
    };

    const updated = [newProject, ...projects];
    await saveStoredProjects(updated);

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized: Incorrect or missing CMS password" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const projects = await getStoredProjects();
    const index = projects.findIndex((p) => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    projects[index] = { ...projects[index], ...body };
    await saveStoredProjects(projects);

    return NextResponse.json({ success: true, project: projects[index] });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized: Incorrect or missing CMS password" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const projects = await getStoredProjects();
    const filtered = projects.filter((p) => p.id !== id);

    if (filtered.length === projects.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await saveStoredProjects(filtered);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project", details: String(error) },
      { status: 500 }
    );
  }
}
