# GEEK ROOM — Website

## Folder Structure

```
geekroom/
├── index.html          ← Home page
├── events.html         ← Events page (upcoming + past)
├── gallery.html        ← Gallery with lightbox + filters
├── contact.html        ← Contact form + info
├── login.html          ← Login page (frontend only)
├── css/
│   └── style.css       ← All styles (dark theme, animations, responsive)
└── js/
    └── main.js         ← All JavaScript (cursor, particles, animations)
```

## Features

### Design
- **Dark futuristic/hacker aesthetic** with neon cyan/blue accents
- **Glassmorphism** cards with border glow on hover
- **Orbitron** (headings) + **Space Mono** (body) fonts
- Custom CSS variables for easy theming

### Animations
- **Page load animation** with progress bar
- **Custom cursor** with glowing dot, ring, and 6-particle trail
- **Particle canvas** background with grid, floating particles + mouse repulsion
- **Scroll reveal** animations via IntersectionObserver
- **Animated number counters** in hero section
- **Glitch text** effect on logo/headings
- **Parallax** on hero glow elements
- **3D tilt** on event/feature cards (mouse tracking)
- **Typing animation** (typewriter) for hero subtext
- **Marquee** tech skills strip (infinite scroll)
- **Shimmer** on primary buttons (hover)
- **Click ripple** glow effect

### Pages
- **Home** — Hero, stats, about, features, pillars, members, CTA
- **Events** — Upcoming (with live countdown timer), past events, hover cards
- **Gallery** — Masonry grid, filter buttons, fullscreen lightbox (keyboard nav)
- **Contact** — Split layout, form with success state, social links, FAQ
- **Login** — Animated rings, grid BG, scanlines, show/hide password, OAuth buttons

## Running the Site

### Option 1 — Simply open in browser
```
Open index.html directly in any modern browser (Chrome/Firefox/Edge).
No server needed for basic functionality.
```

### Option 2 — Local dev server (recommended for full features)
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .

# Using VS Code — install "Live Server" extension and click Go Live
```
Then visit: `http://localhost:8080`

## Fonts (loaded from Google Fonts CDN)
- Orbitron — https://fonts.google.com/specimen/Orbitron
- Space Mono — https://fonts.google.com/specimen/Space+Mono
- Syne — https://fonts.google.com/specimen/Syne

## Replacing Gallery Placeholder Images
The gallery currently uses inline SVG placeholders.
To use real photos, replace the `<svg class="gph" ...>` elements in gallery.html
with standard `<img>` tags pointing to your photos:
```html
<img src="photos/hackbpit-2024.jpg" alt="HackBPIT 2024" />
```

## Browser Support
Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
