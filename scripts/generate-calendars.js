import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'url';

// 1. Setup Paths (Fixing dirname for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

// Input: Your new location in src/data
const dataDir = path.join(root, "src", "data", "weddings");
// Output: Must go to public so they are downloadable URLs
const outDir = path.join(root, "public", "weddings", "calendars");

// Configuration
const SITE_DOMAIN = "kokorolinks.com";
const TIMEZONE = "Asia/Kolkata";

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function listJsonFiles() {
  if (!fs.existsSync(dataDir)) {
    console.error(`Error: Data directory not found at ${dataDir}`);
    return [];
  }
  return fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
}

function escapeICS(text) {
  return String(text ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatInTimeZone(iso) {
  if (!iso) return "19700101T000000Z"; // Fallback for missing dates
  
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid Date format found: "${iso}". Use YYYY-MM-DDTHH:mm:ss`);
  }
  
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function buildCalendar(slug, data) {
  const calName = data.coupleNames ? `${data.coupleNames} Wedding` : `${slug} Wedding`;
  const schedule = Array.isArray(data.schedule) ? [...data.schedule] : [];

  // Add Primary Event if missing
  const primary = data.primaryEvent;
  if (primary && primary.start && primary.end) {
    const hasCeremony = schedule.some((e) => (e.id || "").toLowerCase() === "ceremony");
    if (!hasCeremony) {
      schedule.push({
        id: "ceremony",
        title: primary.title || "Wedding Ceremony",
        start: primary.start,
        end: primary.end,
        locationName: data.primaryVenue?.name,
        address: data.primaryVenue?.address,
        mapUrl: data.primaryVenue?.mapUrl,
        notes: "Main Wedding Ceremony"
      });
    }
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE_DOMAIN}//Wedding Invite//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeICS(calName)}`,
    // We use UTC (Z) times for maximum compatibility, so we don't strictly need VTIMEZONE definitions
    // unless you want "floating" times.
  ];

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  for (const ev of schedule) {
    if (!ev || !ev.start || !ev.end || !ev.title) continue;

    const uid = `${slug}-${ev.id || Math.random().toString(36).substr(2,9)}@${SITE_DOMAIN}`;
    const dtStart = formatInTimeZone(ev.start);
    const dtEnd = formatInTimeZone(ev.end);

    const location = [ev.locationName, ev.address].filter(Boolean).join(", ");
    let desc = ev.notes || "";
    if (ev.mapUrl) desc += `\nMap: ${ev.mapUrl}`;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${escapeICS(uid)}`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART:${dtStart}`); // Using UTC 'Z' format
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${escapeICS(ev.title)}`);
    if (location) lines.push(`LOCATION:${escapeICS(location)}`);
    if (desc) lines.push(`DESCRIPTION:${escapeICS(desc)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

// --- Main Execution ---
console.log("📅 Generating Calendars...");
const files = listJsonFiles();

if (files.length === 0) {
  console.log("No wedding data found.");
} else {
  files.forEach(fileName => {
    const slug = fileName.replace(".json", "");
    const raw = fs.readFileSync(path.join(dataDir, fileName), "utf-8");
    
    try {
      const data = JSON.parse(raw);
      const icsData = buildCalendar(slug, data);
      fs.writeFileSync(path.join(outDir, `${slug}.ics`), icsData);
      console.log(`   ✓ ${slug}.ics`);
    } catch (err) {
      console.error(`   X Failed ${slug}: ${err.message}`);
    }
  });
}
console.log("Done.\n");