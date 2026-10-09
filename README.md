# 🎬 PARKASH EDITS // CINEMATIC VIDEO & MOTION PORTFOLIO

A high-performance, dark-themed 3D interactive portfolio website built for **Parkash** — Video Editor & Motion Graphics Designer. Built with **Next.js 14**, **Three.js**, **@react-three/fiber**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Key Features

### 1. Hero Section (Landing Page)
- **3D Centerpiece Visual**: Prominently displays the exact image file `"Black Shirt Mirror Selfie with DSLR.png"` cleanly mounted inside a 3D titanium-beveled photographic installation with dynamic glass reflection, ARRI/RED viewfinder HUD corner reticles (`[ + ]`), and camera metadata readout (`50mm f/1.2 • ISO 100 • 1/250s`).
- **Anti-Gravity Interactive Elements**: The centerpiece photo is surrounded by floating 3D objects representing video production and motion design:
  - **Glowing Keyframe Diamonds**: Octahedron timeline keyframe diamonds in After Effects Gold, Premiere Cyan, and Cinema Red with emissive edge glow.
  - **3D Camera Lenses**: Multi-tier cylindrical barrels with ribbed focus/zoom grips and convex optical glass elements with cyan/magenta anti-reflective coating shaders.
  - **3D Render Cubes**: Wireframe GPU render node cubes with glowing vertices and rotating internal metallic cores.
  - **Abstract Geometric Shapes**: Chrome Torus Knots, Bezier motion curve spline handles, Cinema clapper slate prisms, and optical dispersion crystals.
- **"Anti-Gravity" Physics Effect**: As the cursor moves across the screen, 3D elements dynamically calculate vector distance from the pointer. When the cursor approaches, items smoothly repel and scatter away with zero-gravity vertical lift, floating weightlessly with inertia and spring restoration when the cursor retreats.
- **Bold Modern Typography**: Bold editorial typography overlaying the 3D space introducing expertise in **Complex Motion Graphics**, **3D Camera Moves**, and **Commercial Video Editing**, accompanied by a live 24fps timecode generator (`00:00:00:00`) and audio ambience controller.

---

### 2. Showcase & Gallery Section
- **Dual Environments**:
  - **🎬 Video Work**: Dedicated to commercial campaigns, 3D camera tracking, and motion VFX.
  - **🎨 Graphics & 3D**: Dedicated to high-res brand identities, streetwear, 3D product renders, packaging, and stickers.
- **View Mode Switcher**:
  - **🌀 3D Dynamic Carousel**: Projects float in an interactive 3D cylindrical curve that responds to horizontal drag gestures and arrow keys.
  - **⊞ 3D Floating Grid**: Responsive grid with interactive 3D perspective tilt on hover and live looping video teasers.
- **Comprehensive Categorization**:
  - **Video Work Categories**:
    1. `3D Modeling & Blender Motion Tracking`
    2. `Complex After Effects Animations`
    3. `Rapid Premiere Pro Edits`
    4. `AI-Generated Commercial Video Content`
  - **Graphics Categories**:
    1. `Brand Identity Logos`
    2. `Custom Apparel & Streetwear Designs`
    3. `Product Display Imagery`
    4. `Pop Art Stickers`
    5. `YouTube Thumbnails`
    6. `Supplement Packaging Labels`
- **Seamless Interactive Transitions**:
  - **Video Work**: Clicking a video thumbnail smoothly transitions via a **3D camera zoom** into a **Full-Screen Cinema Player** with transport controls, frame-by-frame 24fps step, timeline scrubber, timecode, audio mute/unmute, and pipeline tech specs.
  - **Graphics**: Clicking a graphic opens a **3D Pedestal Exhibition View & Lightbox** in WebGL where the artwork is placed on an illuminated 3D pedestal with 360° mouse turntable rotation, wireframe toggle, 4 lighting presets (`Cyber Neon`, `Studio Softbox`, `Clean Tungsten`, `Dark Monolith`), mockup modes (`Pedestal`, `Apparel`, `Packaging Canister`, `Sticker`), texture zoom magnifier, and raw asset download.

---

### 3. Custom Backend CMS & Native Hosting
- **Native Media Hosting**:
  - Direct local storage in `public/uploads/` with native HTTP byte-range streaming (`/api/media/[filename]` and `/uploads/[filename]`).
  - Supports streaming raw video files (`.mp4`, `.webm`) without third-party embeds (YouTube/Vimeo) for uncompressed client presentation.
  - Supports high-resolution graphic files (`.png`, `.jpeg`, `.webp`, `.svg`) and 3D models (`.glb`, `.gltf`).
- **Dual-Upload CMS Dashboard**:
  - Accessible via `/admin` and via the in-app **CMS STUDIO** modal / floating quick-dock button.
  - Dual dropzones: Primary Media (Video/Graphic/3D) and Cover Poster/Thumbnail.
  - Instant file size and format validation with live upload progress.
- **Tagging & Categorization System**:
  - Select between Video Work and Graphics environments.
  - Select exact prompt category tags.
  - Software tagging chips: Blender, Premiere Pro, After Effects, Cinema 4D, Figma, Photoshop, Illustrator, Houdini, Octane, DaVinci Resolve, Midjourney, Runway Gen-3, SynthEyes, CLO 3D.
  - Full project metadata: title, client, year, role, aspect ratio, duration/resolution, creative brief, technical challenge, solution, deliverables, and featured status.
  - Full CRUD: Add, Edit, Delete, Reorder, and JSON Backup Export/Import.

---

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Admin CMS Dashboard
Navigate to **[http://localhost:3000/admin](http://localhost:3000/admin)** or click the **CMS STUDIO** button in the top navigation or bottom-right floating dock.

### Production Build
```bash
npm run build
npm start
```
