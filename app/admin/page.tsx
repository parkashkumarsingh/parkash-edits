"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Film,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  Sliders,
  ExternalLink,
  Download,
  FolderUp,
  RefreshCw,
  HardDrive,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  Project,
  ProjectType,
  VIDEO_CATEGORIES,
  GRAPHIC_CATEGORIES,
  INITIAL_PROJECTS
} from "@/components/projects/ProjectsData";

const COMMON_SOFTWARE = [
  "Adobe Premiere Pro",
  "After Effects",
  "Photoshop",
  "Illustrator",
  "DaVinci Resolve",
  "Adobe Audition",
  "CapCut Pro",
  "Figma",
  "Lightroom",
];

const CMS_PASSWORD = "parkash@1212";

export default function AdminPage() {
  // Password Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "manage" | "inquiries">("upload");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [type, setType] = useState<ProjectType>("video");
  const [category, setCategory] = useState<string>(VIDEO_CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState("2026");
  const [role, setRole] = useState("Video Editor & Motion Designer");
  const [duration, setDuration] = useState("01:00");
  const [aspectRatio, setAspectRatio] = useState("16:9 Widescreen");
  const [description, setDescription] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>(["Adobe Premiere Pro", "After Effects"]);
  const [deliverables, setDeliverables] = useState("1080p / 4K Master, Social Deliverables");
  const [mockupType, setMockupType] = useState<string>("pedestal");
  const [isFeatured, setIsFeatured] = useState(true);

  // Uploaded media URLs
  const [primaryUrl, setPrimaryUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [primaryFileName, setPrimaryFileName] = useState("");
  const [posterFileName, setPosterFileName] = useState("");

  // Upload progress states
  const [primaryUploading, setPrimaryUploading] = useState(false);
  const [primaryProgress, setPrimaryProgress] = useState(0);
  const [posterUploading, setPosterUploading] = useState(false);
  const [posterProgress, setPosterProgress] = useState(0);

  // Drag states
  const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);
  const [isDraggingPoster, setIsDraggingPoster] = useState(false);

  // Status & error messages
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // File input refs
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch {
      setProjects(INITIAL_PROJECTS);
    }
  };

  const loadInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetch("/api/contact", {
        headers: { "x-cms-password": CMS_PASSWORD },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-cms-password": CMS_PASSWORD },
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cms_auth");
      if (stored === "true") {
        setIsAuthenticated(true);
        loadProjects();
        loadInquiries();
      }
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === CMS_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("cms_auth", "true");
      }
      loadProjects();
      loadInquiries();
    } else {
      setAuthError("Incorrect password. Access denied.");
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    setPasswordInput("");
    setAuthError("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("cms_auth");
    }
  };

  const handleTypeChange = (newType: ProjectType) => {
    setType(newType);
    if (newType === "video") {
      setCategory(VIDEO_CATEGORIES[0]);
      setAspectRatio("16:9 Broadcast");
    } else {
      setCategory(GRAPHIC_CATEGORIES[0]);
      setAspectRatio("1:1 Square");
    }
  };

  // Auto-capture video thumbnail directly from video frame
  const handleExtractThumbnail = () => {
    if (!primaryUrl) return;
    setPosterUploading(true);
    setPosterProgress(25);
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.src = primaryUrl;
    v.muted = true;
    v.currentTime = 0.5;

    v.onloadeddata = () => {
      setPosterProgress(65);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth || 1280;
        canvas.height = v.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `thumb_${Date.now()}.jpg`, { type: "image/jpeg" });
              uploadFileImmediate(file, false);
            } else {
              setPosterUploading(false);
            }
          }, "image/jpeg", 0.92);
        } else {
          setPosterUploading(false);
        }
      } catch (e: any) {
        setPosterUploading(false);
        setErrorMsg("Could not auto-extract thumbnail frame: " + e.message);
      }
    };

    v.onerror = () => {
      setPosterUploading(false);
      setErrorMsg("Video source could not be decoded for auto-snapshot.");
    };
  };

  // Immediate upload handler with real-time percentage progress
  const uploadFileImmediate = (file: File, isPrimary: boolean) => {
    setErrorMsg("");
    setStatusMsg("");

    const setUploading = isPrimary ? setPrimaryUploading : setPosterUploading;
    const setProgress = isPrimary ? setPrimaryProgress : setPosterProgress;
    const setUrl = isPrimary ? setPrimaryUrl : setPosterUrl;
    const setName = isPrimary ? setPrimaryFileName : setPosterFileName;

    setUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          setUrl(res.url);
          setName(file.name);
          setStatusMsg(`✓ Uploaded ${file.name} successfully to native storage!`);

          if (isPrimary && !title.trim()) {
            const cleanName = file.name
              .replace(/\.[^/.]+$/, "")
              .replace(/[_-]/g, " ")
              .toUpperCase();
            setTitle(cleanName);
          }
        } catch {
          setErrorMsg("Failed to parse server upload response");
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          setErrorMsg(errRes.error || `Upload failed with status ${xhr.status}`);
        } catch {
          setErrorMsg(`Upload failed with status ${xhr.status}`);
        }
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setErrorMsg("Network error during file upload. Please verify file and server status.");
    };

    xhr.open("POST", "/api/upload", true);
    xhr.setRequestHeader("x-cms-password", CMS_PASSWORD);
    xhr.send(formData);
  };

  const toggleSoftware = (sw: string) => {
    if (selectedSoftware.includes(sw)) {
      setSelectedSoftware(selectedSoftware.filter((s) => s !== sw));
    } else {
      setSelectedSoftware([...selectedSoftware, sw]);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");

    const finalTitle = title.trim() || primaryFileName || "Untitled Project";
    const finalClient = client.trim() || "Studio Commission";
    const finalPrimaryUrl =
      primaryUrl.trim() ||
      (type === "video"
        ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80");
    const finalPosterUrl =
      posterUrl.trim() ||
      (finalPrimaryUrl.endsWith(".mp4") || finalPrimaryUrl.endsWith(".webm")
        ? "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
        : finalPrimaryUrl);

    setSaving(true);
    setStatusMsg("Saving project to portfolio catalog...");

    try {
      const projectData: Partial<Project> = {
        type,
        category: category as any,
        title: finalTitle,
        client: finalClient,
        year: year || "2026",
        role: role || "Video Editor & Motion Designer",
        duration: type === "video" ? duration : undefined,
        dimensions: type === "graphic" ? duration : undefined,
        aspectRatio,
        videoUrl: type === "video" ? finalPrimaryUrl : undefined,
        mediaUrl: finalPrimaryUrl,
        poster: finalPosterUrl,
        description: description || "Commissioned portfolio showcase project.",
        challenge: challenge || "High retention pacing and clean visual execution.",
        solution: solution || "Edited in Premiere Pro & After Effects.",
        mockupType: type === "graphic" ? (mockupType as any) : undefined,
        featured: isFeatured,
        tags: selectedSoftware,
        techSpecs: {
          pipeline: "High-Resolution Native Hosting",
          software: selectedSoftware,
          deliverables: deliverables.split(",").map((s) => s.trim()).filter(Boolean),
        },
      };

      if (editingId) {
        await fetch("/api/projects", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-cms-password": CMS_PASSWORD,
          },
          body: JSON.stringify({ ...projectData, id: editingId }),
        });
      } else {
        await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-cms-password": CMS_PASSWORD,
          },
          body: JSON.stringify(projectData),
        });
      }

      setStatusMsg("✓ Successfully published to native hosting!");
      setPrimaryUrl("");
      setPosterUrl("");
      setPrimaryFileName("");
      setPosterFileName("");
      setTitle("");
      setDescription("");
      setChallenge("");
      setSolution("");
      setEditingId(null);
      await loadProjects();

      setTimeout(() => {
        setStatusMsg("");
        setActiveTab("manage");
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-cms-password": CMS_PASSWORD,
        },
      });
      await loadProjects();
    } catch {
      alert("Error deleting project");
    }
  };

  const handleEdit = (p: Project) => {
    setEditingId(p.id);
    setType(p.type);
    setCategory(p.category);
    setTitle(p.title);
    setClient(p.client);
    setYear(p.year);
    setRole(p.role);
    setDuration(p.duration || p.dimensions || "01:00");
    setAspectRatio(p.aspectRatio);
    setDescription(p.description);
    setChallenge(p.challenge);
    setSolution(p.solution);
    setSelectedSoftware(p.techSpecs.software || []);
    setDeliverables(p.techSpecs.deliverables.join(", "));
    setPrimaryUrl(p.mediaUrl || p.videoUrl || "");
    setPosterUrl(p.poster || "");
    setIsFeatured(!!p.featured);
    if (p.mockupType) setMockupType(p.mockupType);
    setActiveTab("upload");
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-surface-200 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cinema-red/10 border border-cinema-red/30 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(255,59,30,0.3)]">
            <Lock className="w-8 h-8 text-cinema-red animate-pulse" />
          </div>

          <div>
            <span className="text-xs font-mono text-cinema-red uppercase tracking-widest font-bold block mb-1">
              AUTHORIZED ACCESS ONLY
            </span>
            <h2 className="text-2xl font-black uppercase text-white font-sans">
              CMS ADMIN LOGIN
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-2 leading-relaxed">
              Enter the authorized password to upload, edit, or manage portfolio showcase projects.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                placeholder="Enter CMS password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (authError) setAuthError("");
                }}
                className={`w-full px-4 py-3.5 pr-11 rounded-xl bg-surface-300 border text-white placeholder-neutral-500 font-mono text-sm focus:outline-none transition-colors ${
                  authError ? "border-red-500 focus:border-red-500" : "border-white/15 focus:border-cinema-red"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link
                href="/"
                className="w-1/3 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                BACK
              </Link>
              <button
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-cinema-red hover:bg-[#ff5537] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,59,30,0.4)] transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>UNLOCK CMS</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white p-4 sm:p-6 md:p-12 font-sans selection:bg-cinema-red selection:text-white">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cinema-red transition-all"
            title="Return to Live Portfolio"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <span>CMS STUDIO DASHBOARD</span>
              <span className="px-2.5 py-0.5 rounded bg-cinema-cyan/20 border border-cinema-cyan/40 text-cinema-cyan font-mono text-[11px]">
                NATIVE HOSTING ACTIVE
              </span>
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              Direct Dual-Upload & Tagging for Video Work (MP4/WebM) and High-Res Graphics (PNG/WebP/GLB)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={exportBackup}
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT BACKUP</span>
          </button>

          <button
            onClick={handleLock}
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cinema-red text-neutral-300 hover:text-cinema-red flex items-center gap-2 transition-all"
            title="Lock CMS / Log out"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>LOCK</span>
          </button>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-cinema-red hover:bg-[#ff4d30] text-white font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,59,30,0.4)]"
          >
            <span>VIEW LIVE SITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 font-mono text-xs">
          <button
            onClick={() => {
              setEditingId(null);
              setActiveTab("upload");
            }}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "upload"
                ? "bg-white text-black shadow-lg"
                : "bg-surface-200 border border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            {editingId ? "EDIT PROJECT SPECIFICATION" : "+ NEW MEDIA UPLOAD"}
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "manage"
                ? "bg-white text-black shadow-lg"
                : "bg-surface-200 border border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            MANAGE PORTFOLIO ARCHIVE ({projects.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("inquiries");
              loadInquiries();
            }}
            className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "bg-white text-black shadow-lg"
                : "bg-surface-200 border border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>CLIENT INQUIRIES</span>
            {inquiries.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cinema-red text-white text-[10px]">
                {inquiries.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "upload" ? (
          /* Form Content */
          <form onSubmit={handleSaveProject} className="space-y-8 bg-surface-200/60 border border-white/10 rounded-2xl p-6 md:p-10">
            {/* 1. Environment & Category Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-surface-100/70 border border-white/10">
              <div className="space-y-3">
                <label className="text-xs font-mono text-neutral-400 block uppercase">
                  Target Portfolio Environment
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("video")}
                    className={`py-4 px-4 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2.5 transition-all ${
                      type === "video"
                        ? "bg-cinema-red text-white border-cinema-red shadow-[0_0_20px_rgba(255,59,30,0.4)]"
                        : "bg-surface-300 border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    <span>VIDEO WORK</span>
                  </button>

                    <button
                    type="button"
                    onClick={() => handleTypeChange("graphic")}
                    className={`py-4 px-4 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2.5 transition-all ${
                      type === "graphic"
                        ? "bg-cinema-cyan text-black border-cinema-cyan shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                        : "bg-surface-300 border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>GRAPHICS, POSTS & ART</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono text-neutral-400 block uppercase">
                  Exact Gallery Categorization
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-300 border border-white/15 rounded-xl px-4 py-3.5 text-white text-xs font-mono focus:border-cinema-cyan outline-none"
                >
                  {(type === "video" ? VIDEO_CATEGORIES : GRAPHIC_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat} className="bg-surface-300 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Dual Native File Dropzones with INSTANT Upload on Select/Drop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Media Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-300 block uppercase flex items-center justify-between">
                  <span>1. Primary Media File ({type === "video" ? "MP4 / WebM / MOV" : "PNG / JPG / WebP / GLB"})</span>
                  {primaryUrl && (
                    <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> HOSTED NATIVELY
                    </span>
                  )}
                </label>

                <input
                  ref={primaryInputRef}
                  type="file"
                  accept={type === "video" ? "video/*,.mp4,.webm,.mov,.m4v,.mkv" : "image/*,.png,.jpg,.jpeg,.webp,.svg,.glb,.gltf"}
                  onChange={(e) => {
                    if (e.target.files?.[0]) uploadFileImmediate(e.target.files[0], true);
                  }}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingPrimary(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingPrimary(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingPrimary(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingPrimary(false);
                    if (e.dataTransfer.files?.[0]) {
                      uploadFileImmediate(e.dataTransfer.files[0], true);
                    }
                  }}
                  onClick={() => primaryInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[180px] flex flex-col items-center justify-center ${
                    isDraggingPrimary
                      ? "border-cinema-cyan bg-cinema-cyan/10 shadow-[0_0_20px_rgba(0,229,255,0.3)] scale-[1.01]"
                      : primaryUrl
                      ? "border-emerald-500/40 bg-surface-100/60"
                      : "border-white/20 hover:border-cinema-cyan bg-surface-100/40"
                  }`}
                >
                  {primaryUploading ? (
                    <div className="w-full space-y-3 pointer-events-none">
                      <RefreshCw className="w-8 h-8 text-cinema-cyan animate-spin mx-auto" />
                      <p className="text-xs font-mono text-white font-bold">
                        Uploading to Native Host... {primaryProgress}%
                      </p>
                      <div className="w-48 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
                        <div
                          className="h-full bg-cinema-cyan transition-all duration-200"
                          style={{ width: `${primaryProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : primaryUrl ? (
                    <div className="w-full space-y-3 pointer-events-none">
                      {type === "video" || primaryUrl.endsWith(".mp4") || primaryUrl.endsWith(".webm") ? (
                        <div className="relative aspect-video max-h-36 mx-auto rounded-lg overflow-hidden bg-black border border-white/20 shadow-md">
                          <video src={primaryUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] font-mono text-white">
                            PREVIEW
                          </div>
                        </div>
                      ) : (
                        <div className="relative max-h-36 mx-auto rounded-lg overflow-hidden bg-black/50 border border-white/20 flex items-center justify-center p-2">
                          <img src={primaryUrl} alt="Preview" className="max-h-32 object-contain rounded" />
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-white/10 text-cinema-cyan font-mono text-[10px] truncate max-w-xs">
                          {primaryFileName || primaryUrl}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cinema-cyan/20 text-cinema-cyan font-mono text-[10px] font-bold">
                          CLICK TO REPLACE
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-cinema-cyan">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-mono text-white font-bold">
                        {isDraggingPrimary ? "Drop File Here to Upload" : "Click to Browse or Drag File Here"}
                      </p>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Files upload directly to native server storage
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <LinkIcon className="w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={primaryUrl}
                    onChange={(e) => setPrimaryUrl(e.target.value)}
                    placeholder="Or paste direct media URL (/uploads/... or https://...)"
                    className="w-full bg-surface-300 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-[11px] font-mono outline-none focus:border-cinema-cyan"
                  />
                </div>
              </div>

              {/* Poster / Thumbnail Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-300 block uppercase flex items-center justify-between">
                  <span>2. Poster / Thumbnail Image (PNG / JPEG / WebP)</span>
                  {posterUrl && (
                    <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> HOSTED NATIVELY
                    </span>
                  )}
                </label>

                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    if (e.target.files?.[0]) uploadFileImmediate(e.target.files[0], false);
                  }}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingPoster(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingPoster(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingPoster(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingPoster(false);
                    if (e.dataTransfer.files?.[0]) {
                      uploadFileImmediate(e.dataTransfer.files[0], false);
                    }
                  }}
                  onClick={() => posterInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[180px] flex flex-col items-center justify-center ${
                    isDraggingPoster
                      ? "border-cinema-red bg-cinema-red/10 shadow-[0_0_20px_rgba(255,59,30,0.3)] scale-[1.01]"
                      : posterUrl
                      ? "border-emerald-500/40 bg-surface-100/60"
                      : "border-white/20 hover:border-cinema-red bg-surface-100/40"
                  }`}
                >
                  {posterUploading ? (
                    <div className="w-full space-y-3 pointer-events-none">
                      <RefreshCw className="w-8 h-8 text-cinema-red animate-spin mx-auto" />
                      <p className="text-xs font-mono text-white font-bold">
                        Uploading Poster... {posterProgress}%
                      </p>
                      <div className="w-48 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
                        <div
                          className="h-full bg-cinema-red transition-all duration-200"
                          style={{ width: `${posterProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : posterUrl ? (
                    <div className="w-full space-y-3 pointer-events-none">
                      <div className="relative max-h-36 mx-auto rounded-lg overflow-hidden bg-black/50 border border-white/20 flex items-center justify-center p-2">
                        <img src={posterUrl} alt="Thumbnail Preview" className="max-h-32 object-contain rounded" />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-white/10 text-cinema-red font-mono text-[10px] truncate max-w-xs">
                          {posterFileName || posterUrl}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cinema-red/20 text-cinema-red font-mono text-[10px] font-bold">
                          CLICK TO REPLACE
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-cinema-red">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-mono text-white font-bold">
                        {isDraggingPoster ? "Drop Thumbnail Here" : "Click to Browse or Drag Thumbnail"}
                      </p>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Cover image for 3D carousel & floating grid
                      </p>
                    </div>
                  )}
                </div>

                {/* Auto-Extract Video Thumbnail Button */}
                {type === "video" && primaryUrl && (
                  <button
                    type="button"
                    onClick={handleExtractThumbnail}
                    disabled={posterUploading}
                    className="w-full py-2 px-3 rounded-xl bg-surface-100 hover:bg-cinema-red/20 border border-cinema-red/30 text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-cinema-red ${posterUploading ? "animate-spin" : ""}`} />
                    <span>📸 Auto-Extract Thumbnail From Video Frame</span>
                  </button>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <LinkIcon className="w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="Or paste direct poster URL (/uploads/... or https://...)"
                    className="w-full bg-surface-300 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-[11px] font-mono outline-none focus:border-cinema-red"
                  />
                </div>
              </div>
            </div>

            {/* 3. Project Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-neutral-400">PROJECT TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. TOKYO DRIFT // 3D TRACKING"
                  className="w-full bg-surface-300 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400">CLIENT / COMMISSION</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. RED BULL RACING"
                  className="w-full bg-surface-300 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400">RELEASE YEAR</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-surface-300 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400">ROLE</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead 3D Artist & Motion Designer"
                  className="w-full bg-surface-300 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400">
                  {type === "video" ? "DURATION (MM:SS)" : "DIMENSIONS / RESOLUTION"}
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder={type === "video" ? "01:30" : "8K UHD // 300 DPI"}
                  className="w-full bg-surface-300 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400">
                  {type === "video" ? "ASPECT RATIO / FRAME SIZE" : "IMAGE / POST FORMAT"}
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-surface-300 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
                >
                  {type === "video" ? (
                    <>
                      <option value="9:16 Vertical Reel">9:16 Vertical Reel (Instagram / TikTok / Shorts)</option>
                      <option value="16:9 Broadcast">16:9 Broadcast (YouTube / Standard Widescreen)</option>
                      <option value="2.39:1 Cinemascope">2.39:1 Cinemascope (Film Anamorphic)</option>
                      <option value="1:1 Square">1:1 Square (Social Feed)</option>
                      <option value="4:5 Portrait">4:5 Social Portrait</option>
                    </>
                  ) : (
                    <>
                      <option value="1:1 Square">1:1 Square (Instagram Feed / Post)</option>
                      <option value="4:5 Portrait">4:5 Portrait (Instagram High-Impact Feed)</option>
                      <option value="9:16 Vertical">9:16 Vertical (Story / Reel Graphic)</option>
                      <option value="16:9 Landscape">16:9 Landscape (Twitter / YouTube / Banner)</option>
                      <option value="Vector Logo">Vector Logo / Brand Emblem</option>
                      <option value="Print 300 DPI">Print 300 DPI (Merch / Apparel / Packaging)</option>
                    </>
                  )}
                </select>
              </div>

              {type === "video" && (
                <div className="md:col-span-3 p-3 rounded-xl bg-cinema-red/10 border border-cinema-red/20 text-cinema-red font-mono text-xs flex items-center gap-2">
                  <span>✨ Auto Frame Adaptation: The player will automatically adapt its size to 9:16 Reel size or 16:9 YouTube size based on the video&apos;s natural dimensions when played!</span>
                </div>
              )}
            </div>

            {/* 4. Narrative Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-neutral-400">PROJECT OVERVIEW & CREATIVE DIRECTION</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cinematic narrative summary..."
                  className="w-full bg-surface-300 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-white/30 font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400">TECHNICAL CHALLENGE & EXECUTION</label>
                <textarea
                  rows={4}
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="3D tracking solver, shader optimization, render pipeline..."
                  className="w-full bg-surface-300 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-white/30 font-sans"
                />
              </div>
            </div>

            {/* 5. Software Stack Chips */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-neutral-400 uppercase">
                Software & Tool Ecosystem
              </label>
              <div className="flex flex-wrap gap-2.5">
                {COMMON_SOFTWARE.map((sw) => {
                  const isSelected = selectedSoftware.includes(sw);
                  return (
                    <button
                      key={sw}
                      type="button"
                      onClick={() => toggleSoftware(sw)}
                      className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                        isSelected
                          ? "bg-cinema-cyan text-black font-bold shadow-sm"
                          : "bg-surface-300 border border-white/10 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {isSelected ? `✓ ${sw}` : `+ ${sw}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Mockup Mode for Graphics */}
            {type === "graphic" && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-neutral-400 uppercase">
                  3D Pedestal Display Mode
                </label>
                <div className="flex flex-wrap gap-3 font-mono text-xs">
                  {(["pedestal", "apparel", "packaging", "sticker", "print"] as const).map(
                    (m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMockupType(m)}
                        className={`px-4 py-2 rounded-xl border uppercase transition-all ${
                          mockupType === m
                            ? "bg-cinema-cyan text-black font-bold border-cinema-cyan"
                            : "bg-surface-300 border-white/10 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {m}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Alerts */}
            {statusMsg && (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{statusMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={saving || primaryUploading || posterUploading}
                className="px-8 py-4 rounded-full bg-cinema-red text-white font-mono text-xs font-black tracking-widest uppercase hover:bg-[#ff4d30] disabled:opacity-50 transition-all shadow-[0_0_25px_rgba(255,59,30,0.5)]"
              >
                {saving
                  ? "SAVING TO PORTFOLIO..."
                  : primaryUploading || posterUploading
                  ? "UPLOADING MEDIA FILE..."
                  : editingId
                  ? "UPDATE PROJECT"
                  : "PUBLISH TO PORTFOLIO"}
              </button>
            </div>
          </form>
        ) : activeTab === "manage" ? (
          /* Manage Tab */
          <div className="space-y-6 bg-surface-200/60 border border-white/10 rounded-2xl p-6 md:p-8 font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <p className="text-neutral-400">
                ACTIVE PORTFOLIO ARCHIVE: <span className="text-white font-bold">{projects.length} PROJECTS</span>
              </p>
              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveTab("upload");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cinema-red text-white font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW PROJECT</span>
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="py-4 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.02] px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={proj.poster || proj.mediaUrl}
                      alt={proj.title}
                      className="w-20 h-12 object-cover rounded-lg bg-black border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            proj.type === "video"
                              ? "bg-cinema-red/20 text-cinema-red border border-cinema-red/30"
                              : "bg-cinema-cyan/20 text-cinema-cyan border border-cinema-cyan/30"
                          }`}
                        >
                          {proj.type.toUpperCase()}
                        </span>
                        <h4 className="text-white font-bold text-base truncate max-w-md">
                          {proj.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        {proj.client} • {proj.category} • {proj.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(proj)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>EDIT</span>
                    </button>

                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-300 hover:bg-rose-900/60 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>DELETE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Client Inquiries Tab */
          <div className="space-y-6 bg-surface-200/60 border border-white/10 rounded-2xl p-6 md:p-8 font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cinema-red animate-pulse" />
                <p className="text-white font-bold text-sm">
                  RECEIVED CLIENT BRIEFS & INQUIRIES ({inquiries.length})
                </p>
              </div>
              <button
                onClick={loadInquiries}
                disabled={inquiriesLoading}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${inquiriesLoading ? "animate-spin" : ""}`} />
                <span>REFRESH</span>
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Mail className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-neutral-400 text-sm">No client inquiries received yet.</p>
                <p className="text-[11px] text-neutral-600 max-w-md mx-auto">
                  When visitors send a project inquiry from the contact form, their details will appear here and be delivered to <strong className="text-white">itsparkash21@gmail.com</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-xl bg-surface-300/60 border border-white/10 space-y-3 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{inq.name}</span>
                        <span className="text-neutral-400">({inq.email})</span>
                        {inq.agency && inq.agency !== "Not provided" && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 text-[10px]">
                            {inq.agency}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                        <span>{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="px-2.5 py-1 rounded bg-cinema-red/10 border border-cinema-red/20 text-cinema-red font-bold">
                        SERVICE: {inq.service}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-cinema-cyan/10 border border-cinema-cyan/20 text-cinema-cyan font-bold">
                        BUDGET: {inq.budget}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 text-neutral-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {inq.message}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <a
                        href={`mailto:${inq.email}?subject=${encodeURIComponent(
                          `Re: Project Inquiry (${inq.service}) - Parkash Edits`
                        )}&body=${encodeURIComponent(
                          `Hi ${inq.name},\n\nThank you for reaching out regarding your ${inq.service} project!\n\nBest regards,\nParkash`
                        )}`}
                        className="px-3.5 py-1.5 rounded-lg bg-cinema-red text-white font-bold hover:bg-[#ff4d30] flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>REPLY VIA EMAIL</span>
                      </a>
                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-300 hover:bg-rose-900/60 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
