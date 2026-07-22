"use client";

import React from "react";
import { BiodataTemplate, BiodataFormData } from "@/types";
import { formatDate, calculateAge } from "@/lib/utils";

interface Props {
  template: BiodataTemplate;
  data: Partial<BiodataFormData>;
  scale?: number;
}

export default function TemplateRenderer({ template, data, scale = 1 }: Props) {
  const A4_WIDTH = 794; // px at 96dpi
  const A4_HEIGHT = 1123; // px at 96dpi

  const containerStyle: React.CSSProperties = {
    width: `${A4_WIDTH}px`,
    height: `${A4_HEIGHT}px`,
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: scale !== 1 ? "top left" : undefined,
    position: "relative",
    overflow: "hidden",
  };

  const inner = (() => {
    switch (template.collectionId) {
      case "floral":      return <FloralBiodata template={template} data={data} />;
      case "royal":       return <RoyalBiodata template={template} data={data} />;
      case "traditional": return <TraditionalBiodata template={template} data={data} />;
      case "modern":      return <ModernBiodata template={template} data={data} />;
      case "luxury":      return <LuxuryBiodata template={template} data={data} />;
      case "heritage":    return <HeritageBiodata template={template} data={data} />;
      default:            return <FloralBiodata template={template} data={data} />;
    }
  })();

  return (
    <div style={containerStyle} id="biodata-preview" data-template={template.id}>
      <AutoFitContent maxHeight={A4_HEIGHT}>
        {inner}
      </AutoFitContent>
    </div>
  );
}

/** Scales down child content if it exceeds maxHeight */
function AutoFitContent({ children, maxHeight }: { children: React.ReactNode; maxHeight: number }) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = React.useState(1);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const contentHeight = el.scrollHeight;
      if (contentHeight > maxHeight) {
        setFitScale(maxHeight / contentHeight);
      } else {
        setFitScale(1);
      }
    });

    observer.observe(el);
    // Initial check
    const contentHeight = el.scrollHeight;
    if (contentHeight > maxHeight) {
      setFitScale(maxHeight / contentHeight);
    }

    return () => observer.disconnect();
  }, [maxHeight]);

  return (
    <div
      ref={contentRef}
      style={{
        transformOrigin: "top left",
        transform: fitScale < 1 ? `scale(${fitScale})` : undefined,
        width: fitScale < 1 ? `${100 / fitScale}%` : "100%",
      }}
    >
      {children}
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

interface BP { template: BiodataTemplate; data: Partial<BiodataFormData> }

function notNull<T>(x: T | null): x is T { return x !== null; }

// ─── Deity image map — assigns a real image per template ─────────────────────

const DEITY_IMAGES: Record<string, { src: string; h: number; blend?: boolean }> = {
  // Royal collection
  "royal-maharaja":    { src: "/deities/rk-realistic.jpg",         h: 195 },
  "royal-rajwadi":     { src: "/deities/rk-profile-flowers2.jpg",  h: 200 },
  "royal-gold":        { src: "/deities/rk-profile-flowers.jpg",   h: 200 },
  "royal-ivory":       { src: "/deities/rk-outline.jpg",           h: 185 },
  // Floral collection
  "floral-rose":       { src: "/deities/rk-silhouette.jpg",        h: 185 },
  "floral-lotus":      { src: "/deities/rk-sitting.jpg",           h: 175 },
  "floral-jasmine":    { src: "/deities/rk-cute-chibi.jpg",        h: 170 },
  // Traditional collection
  "traditional-vedic": { src: "/deities/rk-stencil-orange.jpg",    h: 180, blend: true },
  "traditional-kashi": { src: "/deities/rk-profile-flowers2.jpg",  h: 180 },
  "traditional-mangal":{ src: "/deities/rk-bw-cute.jpg",           h: 175, blend: true },
  // Heritage collection
  "heritage-vintage":  { src: "/deities/rk-outline.jpg",           h: 175 },
  "heritage-temple":   { src: "/deities/rk-stencil-orange.jpg",    h: 180 },
};

interface DeityImageProps {
  templateId: string;
  gold: string;
  /** true when placed on a dark/colored header banner */
  onDarkBg?: boolean;
}

function DeityImage({ templateId, gold, onDarkBg = false }: DeityImageProps) {
  return null;
}

function row(label: string, value?: string | null) {
  if (!value) return null;
  return { label, value };
}

function personalRows(data: Partial<BiodataFormData>) {
  const p = data.personal; const e = data.education; const c = data.career;
  const a = p?.dateOfBirth ? calculateAge(p.dateOfBirth) : null;
  return [
    row("Date of Birth", p?.dateOfBirth ? formatDate(p.dateOfBirth) : null),
    row("Age", a ? `${a} Years` : null),
    row("Time of Birth", p?.timeOfBirth),
    row("Place of Birth", p?.placeOfBirth),
    row("Height", p?.height),
    row("Complexion", p?.complexion),
    row("Blood Group", p?.bloodGroup),
    row("Religion", p?.religion),
    row("Caste / Gotra", p?.caste && p?.gotra ? `${p.caste} / ${p.gotra}` : p?.caste ?? p?.gotra),
    row("Nakshatra", p?.nakshatra),
    row("Rashi", p?.rashi),
    row("Manglik", p?.manglik),
    row("Qualification", e?.highestQualification),
    row("Field", e?.fieldOfStudy),
    row("Profession", c?.currentDesignation),
    row("Organisation", c?.company),
    row("Annual Income", c?.annualIncome),
    row("City", data.contact?.city),
    row("State", data.contact?.state),
  ].filter(Boolean) as { label: string; value: string }[];
}

function familyRows(data: Partial<BiodataFormData>) {
  const f = data.family;
  return [
    row("Father", f?.fatherName), row("Father's Work", f?.fatherOccupation),
    row("Mother", f?.motherName), row("Mother's Work", f?.motherOccupation),
    row("Siblings", f?.siblings), row("Family Type", f?.familyType),
    row("Native Place", f?.nativePlace),
  ].filter(Boolean) as { label: string; value: string }[];
}

function expectationRows(data: Partial<BiodataFormData>) {
  const ex = data.expectations;
  const ageRange = ex?.preferredAgeFrom && ex?.preferredAgeTo ? `${ex.preferredAgeFrom}–${ex.preferredAgeTo} years` : null;
  return [
    row("Age", ageRange), row("Height", ex?.preferredHeight),
    row("Caste", ex?.preferredCaste), row("Education", ex?.preferredEducation),
    row("Profession", ex?.preferredProfession), row("Location", ex?.preferredLocation),
    row("Other", ex?.otherExpectations),
  ].filter(Boolean) as { label: string; value: string }[];
}

// ─── ❶ FLORAL BIODATA ────────────────────────────────────────────────────────

function FloralBiodata({ template, data }: BP) {
  const { colors } = template;
  const name = data.personal?.fullName || "Your Name";
  const pRows = personalRows(data); const fRows = familyRows(data); const eRows = expectationRows(data);

  return (
    <div style={{ width: "794px", minHeight: "1123px", background: `linear-gradient(160deg,#FFF0F5 0%,#FFFBFC 40%,#FFFFFF 100%)`, fontFamily: "'Nunito','Segoe UI',sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: "10px", border: `2px solid ${colors.primary}40`, borderRadius: "6px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: "15px", border: `1px solid ${colors.accent}`, borderRadius: "4px", pointerEvents: "none" }} />
      {/* Botanical vine corners — larger, extend along edges */}
      {[{ top: 0, left: 0 }, { top: 0, right: 0, transform: "scaleX(-1)" }, { bottom: 0, left: 0, transform: "scaleY(-1)" }, { bottom: 0, right: 0, transform: "scale(-1,-1)" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, pointerEvents: "none" }}><FloralCornerSVG color={colors.primary} /></div>
      ))}

      <div style={{ textAlign: "center", padding: "44px 80px 16px" }}>
        <FloralGarlandSVG color={colors.primary} />

        {/* Radha-Krishna image from uploaded assets */}
        <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 6px" }}>
          <DeityImage templateId={template.id} gold={colors.secondary} onDarkBg={false} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 10px" }}>
          <FloralPhotoFrame photoUrl={data.photoUrl} color={colors.primary} accent={colors.accent} />
        </div>
        <div style={{ fontFamily: "'Dancing Script','Georgia',cursive", fontSize: "48px", fontWeight: 700, color: colors.primary, lineHeight: 1.1, marginBottom: "6px", letterSpacing: "1px" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ color: colors.primary }}>✿</span>
          <span style={{ fontSize: "10px", fontWeight: 700, color: colors.secondary, letterSpacing: "5px", textTransform: "uppercase" }}>Marriage Biodata</span>
          <span style={{ color: colors.primary }}>✿</span>
        </div>
        <div style={{ fontSize: "10px", color: colors.secondary, letterSpacing: "3px", opacity: 0.8 }}>✦ MARRIAGE BIODATA ✦</div>
        <div style={{ marginTop: "10px" }}><FloralGarlandSVG color={colors.primary} /></div>
      </div>

      <div style={{ padding: "4px 50px 40px" }}>
        <FloralSection title="Personal Details" color={colors.primary}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 24px" }}>
            {pRows.map(({ label, value }) => <FloralInfoRow key={label} label={label} value={value} color={colors.primary} secondary={colors.secondary} />)}
          </div>
        </FloralSection>

        {data.aboutMe && (
          <FloralSection title="About Me" color={colors.primary}>
            <p style={{ fontSize: "12px", lineHeight: 1.8, color: "#555", textAlign: "center", fontStyle: "italic", margin: "0 20px" }}>❝ {data.aboutMe} ❞</p>
            {data.hobbies && <p style={{ textAlign: "center", fontSize: "11px", color: colors.secondary, marginTop: "6px" }}><strong>Hobbies:</strong> {data.hobbies}</p>}
          </FloralSection>
        )}

        <div style={{ display: "flex", gap: "18px" }}>
          {fRows.length > 0 && (
            <div style={{ flex: 1 }}>
              <FloralSection title="Family" color={colors.primary} compact>
                {fRows.map(({ label, value }) => <FloralInfoRow key={label} label={label} value={value} color={colors.primary} secondary={colors.secondary} />)}
              </FloralSection>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <FloralSection title="Education & Career" color={colors.primary} compact>
              {[row("Qualification",data.education?.highestQualification),row("Field",data.education?.fieldOfStudy),row("Employment",data.career?.employmentType),row("Designation",data.career?.currentDesignation),row("Company",data.career?.company),row("Income",data.career?.annualIncome)].filter(notNull).map(({ label, value }: { label: string; value: string }) => <FloralInfoRow key={label} label={label} value={value} color={colors.primary} secondary={colors.secondary} />)}
            </FloralSection>
          </div>
        </div>

        {eRows.length > 0 && (
          <FloralSection title="Partner Expectations" color={colors.primary}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 24px" }}>
              {eRows.map(({ label, value }) => <FloralInfoRow key={label} label={label} value={value} color={colors.primary} secondary={colors.secondary} />)}
            </div>
          </FloralSection>
        )}

        {data.contact && (
          <div style={{ marginTop: "16px", background: `linear-gradient(135deg,${colors.primary}15,${colors.accent}30)`, borderRadius: "12px", padding: "16px", border: `1px solid ${colors.primary}30`, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ color: colors.primary }}>✿</span>
              <span style={{ fontSize: "11px", fontWeight: 800, color: colors.primary, letterSpacing: "3px", textTransform: "uppercase" }}>Contact</span>
              <span style={{ color: colors.primary }}>✿</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", fontSize: "12px", color: "#444" }}>
              {data.contact.contactName && <span>👤 {data.contact.contactName}</span>}
              {data.contact.phone && <span>📞 {data.contact.phone}</span>}
              {data.contact.email && <span>✉ {data.contact.email}</span>}
              {data.contact.city && <span>📍 {data.contact.city}, {data.contact.state}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FloralCornerSVG({ color }: { color: string }) {
  // Botanical vine corner — inspired by reference image 2
  // Extends 210px along both edges with realistic leaves
  const vine = "#1A6B3C";
  const leaf = "#2D8A50";
  return (
    <svg viewBox="0 0 210 210" width={210} height={210} overflow="visible">
      {/* Corner spiral coil */}
      <path d="M 16 4 C 24 4 30 10 30 18 C 30 26 22 30 16 30 C 8 30 4 24 4 16 C 4 10 9 7 14 7 C 18 7 21 10 21 15 C 21 19 17 21 14 20 C 12 19 12 17 13 17"
        stroke={vine} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Horizontal vine along top edge */}
      <path d="M 30 17 C 45 12 62 19 79 14 C 96 9 113 18 130 13 C 147 8 165 17 182 12 C 193 9 202 14 210 13"
        stroke={vine} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Vertical vine along left edge */}
      <path d="M 17 30 C 12 45 19 62 14 79 C 9 96 18 113 13 130 C 8 147 17 165 12 182 C 9 193 14 202 13 210"
        stroke={vine} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Leaves on horizontal vine — alternating up/down */}
      {/* Leaf 1 up at x≈50 */}
      <path d="M 48 14 C 43 4 32 2 35 9 C 37 14 46 15 48 14 Z" fill={leaf} opacity="0.85" />
      <path d="M 48 14 C 43 4 32 2 35 9" stroke={vine} strokeWidth="0.8" fill="none" />
      {/* Leaf 2 down at x≈73 */}
      <path d="M 71 15 C 75 25 86 26 83 19 C 81 14 73 13 71 15 Z" fill={leaf} opacity="0.8" />
      {/* Leaf 3 up at x≈98 */}
      <path d="M 96 13 C 91 3 80 1 83 8 C 85 13 94 14 96 13 Z" fill={leaf} opacity="0.85" />
      {/* Leaf 4 down at x≈122 */}
      <path d="M 120 14 C 124 24 135 25 132 18 C 130 13 122 12 120 14 Z" fill={leaf} opacity="0.8" />
      {/* Leaf 5 up at x≈148 */}
      <path d="M 146 12 C 141 2 130 0 133 7 C 135 12 144 13 146 12 Z" fill={leaf} opacity="0.85" />
      {/* Leaf 6 down at x≈172 */}
      <path d="M 170 13 C 174 23 185 24 182 17 C 180 12 172 11 170 13 Z" fill={leaf} opacity="0.8" />

      {/* Leaves on vertical vine — alternating left/right */}
      {/* Leaf 1 left at y≈50 */}
      <path d="M 14 48 C 4 43 2 32 9 35 C 14 37 15 46 14 48 Z" fill={leaf} opacity="0.85" />
      <path d="M 14 48 C 4 43 2 32 9 35" stroke={vine} strokeWidth="0.8" fill="none" />
      {/* Leaf 2 right at y≈73 */}
      <path d="M 15 71 C 25 75 26 86 19 83 C 14 81 13 73 15 71 Z" fill={leaf} opacity="0.8" />
      {/* Leaf 3 left at y≈98 */}
      <path d="M 13 96 C 3 91 1 80 8 83 C 13 85 14 94 13 96 Z" fill={leaf} opacity="0.85" />
      {/* Leaf 4 right at y≈122 */}
      <path d="M 14 120 C 24 124 25 135 18 132 C 13 130 12 122 14 120 Z" fill={leaf} opacity="0.8" />
      {/* Leaf 5 left at y≈148 */}
      <path d="M 12 146 C 2 141 0 130 7 133 C 12 135 13 144 12 146 Z" fill={leaf} opacity="0.85" />
      {/* Leaf 6 right at y≈172 */}
      <path d="M 13 170 C 23 174 24 185 17 182 C 12 180 11 172 13 170 Z" fill={leaf} opacity="0.8" />

      {/* Secondary thin tendrils curling off main vines */}
      <path d="M 63 17 C 63 10 69 8 68 13" stroke={vine} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 112 16 C 112 9 118 7 117 12" stroke={vine} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 163 14 C 163 7 169 5 168 10" stroke={vine} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 17 63 C 10 63 8 69 13 68" stroke={vine} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 16 112 C 9 112 7 118 12 117" stroke={vine} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 14 163 C 7 163 5 169 10 168" stroke={vine} strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Small bud circles at tendril tips */}
      <circle cx="68" cy="8" r="2.5" fill={color} opacity="0.7" />
      <circle cx="117" cy="7" r="2.5" fill={color} opacity="0.7" />
      <circle cx="168" cy="5" r="2" fill={color} opacity="0.6" />
      <circle cx="8" cy="68" r="2.5" fill={color} opacity="0.7" />
      <circle cx="7" cy="117" r="2.5" fill={color} opacity="0.7" />
      <circle cx="5" cy="168" r="2" fill={color} opacity="0.6" />

      {/* End curl of vine */}
      <path d="M 210 13 C 210 9 206 8 206 11" stroke={vine} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 13 210 C 9 210 8 206 11 206" stroke={vine} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function FloralGarlandSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 500 28" width="100%" height="28">
      <path d="M 0 14 Q 60 6 120 14 Q 180 22 240 14 Q 300 6 360 14 Q 420 22 500 14" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
      {[60,120,180,240,300,360,420].map((x, i) => (
        <g key={x} transform={`translate(${x},${i%2===0?8:20})`}>{[0,90,180,270].map(a => <ellipse key={a} rx="2.5" ry="5" fill={color} opacity="0.7" transform={`rotate(${a}) translate(0,-5.5)`} />)}<circle r="3.5" fill={color} opacity="0.9" /></g>
      ))}
    </svg>
  );
}

function FloralPhotoFrame({ photoUrl, color, accent }: { photoUrl?: string; color: string; accent: string }) {
  const size = 150;
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`,
      borderRadius: "50%", overflow: "hidden",
      border: `4px solid ${color}`,
      boxShadow: `0 0 0 4px white, 0 0 0 8px ${color}50, 0 6px 24px ${color}30`,
      background: `${accent}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {photoUrl
        ? <img src={photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: "56px", opacity: 0.35 }}>👤</span>
      }
    </div>
  );
}

function FloralSection({ title, color, children, compact }: { title: string; color: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div style={{ marginBottom: compact ? "10px" : "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right,transparent,${color}60)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ color, fontSize: "12px" }}>✿</span><span style={{ fontFamily: "'Dancing Script',cursive", fontSize: "16px", fontWeight: 700, color, letterSpacing: "1px" }}>{title}</span><span style={{ color, fontSize: "12px" }}>✿</span></div>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left,transparent,${color}60)` }} />
      </div>
      <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "10px", padding: "10px 14px", border: `1px solid ${color}20` }}>{children}</div>
    </div>
  );
}

function FloralInfoRow({ label, value, color, secondary }: { label: string; value: string; color: string; secondary: string }) {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", padding: "2px 0" }}>
      <span style={{ color, fontSize: "8px", marginTop: "4px", flexShrink: 0 }}>✿</span>
      <span style={{ fontSize: "10px", color: secondary, fontWeight: 700, minWidth: "80px", flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.3px" }}>{label}</span>
      <span style={{ fontSize: "11px", color: "#333", flex: 1 }}>: {value}</span>
    </div>
  );
}

// ─── ❷ ROYAL BIODATA ─────────────────────────────────────────────────────────

function RoyalBiodata({ template, data }: BP) {
  const { colors, fonts } = template;
  const name = data.personal?.fullName || "Your Name";
  const pRows = personalRows(data); const fRows = familyRows(data); const eRows = expectationRows(data);

  return (
    <div style={{ width: "794px", minHeight: "1123px", background: colors.background, fontFamily: "'Lato',sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: "8px", border: `2px solid ${colors.secondary}`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: "13px", border: `1px solid ${colors.accent}50`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: "17px", border: `1px solid ${colors.secondary}30`, pointerEvents: "none" }} />
      {/* Ornate mandala corners */}
      {[{ top: 0, left: 0 }, { top: 0, right: 0, transform: "scaleX(-1)" }, { bottom: 0, left: 0, transform: "scaleY(-1)" }, { bottom: 0, right: 0, transform: "scale(-1,-1)" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, pointerEvents: "none" }}><RoyalCornerSVG color={colors.secondary} /></div>
      ))}

      <div style={{ background: `linear-gradient(135deg,${colors.primary} 0%,#4A0808 60%,${colors.primary} 100%)`, padding: "28px 80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "6px 6px" }} />
        {/* Radha-Krishna — different image per template, medallion-framed on dark bg */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
          <DeityImage templateId={template.id} gold={colors.secondary} onDarkBg />
        </div>
        <div style={{ fontSize: "11px", color: colors.secondary, letterSpacing: "4px", marginBottom: "8px", opacity: 0.9 }}>✦ MARRIAGE BIODATA ✦</div>
        <div style={{ fontFamily: `'${fonts.heading}',serif`, fontSize: "50px", fontWeight: 700, color: colors.secondary, lineHeight: 1.05, letterSpacing: "2px", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right,transparent,${colors.secondary}80)` }} />
          <span style={{ fontSize: "11px", color: colors.secondary, fontWeight: 600, letterSpacing: "5px" }}>MARRIAGE BIODATA</span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left,transparent,${colors.secondary}80)` }} />
        </div>
        <div style={{ marginTop: "10px" }}><RoyalDividerSVG color={colors.secondary} /></div>
      </div>

      <div style={{ padding: "24px 50px 40px" }}>
        <div style={{ display: "flex", gap: "28px", marginBottom: "20px" }}>
          <div style={{ width: "190px", flexShrink: 0, textAlign: "center" }}>
            <RoyalPhotoFrame photoUrl={data.photoUrl} colors={colors} />
            <div style={{ marginTop: "12px", background: colors.lightBg, borderRadius: "8px", padding: "10px", border: `1px solid ${colors.accent}` }}>
              {[row("Height",data.personal?.height),row("Religion",data.personal?.religion),row("Caste",data.personal?.caste),row("Gotra",data.personal?.gotra)].filter(notNull).map(({ label, value }: { label: string; value: string }) => (
                <div key={label} style={{ display: "flex", gap: "4px", marginBottom: "4px" }}><span style={{ fontSize: "9px", color: colors.secondary, fontWeight: 700, minWidth: "52px", textTransform: "uppercase" }}>{label}</span><span style={{ fontSize: "10px", color: colors.text }}>: {value}</span></div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <RoyalSectionHeader title="Personal Details" colors={colors} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", marginTop: "8px" }}>
              {pRows.map(({ label, value }) => <RoyalInfoRow key={label} label={label} value={value} colors={colors} />)}
            </div>
          </div>
        </div>

        {data.aboutMe && (
          <div style={{ marginBottom: "16px" }}>
            <RoyalSectionHeader title="About Me" colors={colors} />
            <div style={{ background: colors.lightBg, borderRadius: "8px", padding: "12px 16px", border: `1px solid ${colors.accent}`, marginTop: "8px" }}>
              <p style={{ fontSize: "12px", lineHeight: 1.7, color: colors.text, fontStyle: "italic", textAlign: "center" }}>❝ {data.aboutMe} ❞</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
          {fRows.length > 0 && <div style={{ flex: 1 }}><RoyalSectionHeader title="Family Details" colors={colors} /><div style={{ marginTop: "8px" }}>{fRows.map(({ label, value }) => <RoyalInfoRow key={label} label={label} value={value} colors={colors} />)}</div></div>}
          <div style={{ flex: 1 }}>
            <RoyalSectionHeader title="Education & Career" colors={colors} />
            <div style={{ marginTop: "8px" }}>
              {[row("Qualification",data.education?.highestQualification),row("Field",data.education?.fieldOfStudy),row("Employment",data.career?.employmentType),row("Designation",data.career?.currentDesignation),row("Company",data.career?.company),row("Income",data.career?.annualIncome)].filter(notNull).map(({ label, value }: { label: string; value: string }) => <RoyalInfoRow key={label} label={label} value={value} colors={colors} />)}
            </div>
          </div>
        </div>

        {eRows.length > 0 && <div style={{ marginBottom: "16px" }}><RoyalSectionHeader title="Partner Expectations" colors={colors} /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", marginTop: "8px" }}>{eRows.map(({ label, value }) => <RoyalInfoRow key={label} label={label} value={value} colors={colors} />)}</div></div>}

        <div style={{ background: `linear-gradient(135deg,${colors.primary}18,${colors.lightBg})`, borderRadius: "10px", padding: "16px", border: `1px solid ${colors.secondary}40`, marginTop: "16px" }}>
          <div style={{ textAlign: "center", marginBottom: "10px" }}><span style={{ fontSize: "10px", fontWeight: 700, color: colors.secondary, letterSpacing: "4px", textTransform: "uppercase" }}>✦ Contact Details ✦</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
            {[{icon:"👤",val:data.contact?.contactName},{icon:"📞",val:data.contact?.phone},{icon:"✉",val:data.contact?.email},{icon:"📍",val:data.contact?.city?`${data.contact.city}, ${data.contact.state}`:null}].filter(x=>x.val).map(({icon,val})=>(
              <span key={val} style={{ fontSize: "12px", color: colors.text, display: "flex", alignItems: "center", gap: "4px" }}>{icon} {val}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Deity SVG illustrations ──────────────────────────────────────────────────

function GaneshaSVG({ gold, light }: { gold: string; light: string }) {
  // Stylized Ganesha — elephant head, trunk curling right, 4 arms, crown
  const skin = "#F4A44A", skinL = "#F9C080", tusk = "#FFF9C4";
  return (
    <svg viewBox="0 0 130 155" width="130" height="155">
      {/* Radiant aureole */}
      <circle cx="65" cy="78" r="56" fill={gold} opacity="0.1" />
      {[0,22.5,45,67.5,90,112.5,135,157.5].map((a,i) => {
        const r = 54, R = 60;
        const rad = a * Math.PI / 180;
        return <line key={i} x1={65+r*Math.cos(rad)} y1={78+r*Math.sin(rad)} x2={65+R*Math.cos(rad)} y2={78+R*Math.sin(rad)} stroke={gold} strokeWidth="2" opacity="0.35" />;
      })}
      <circle cx="65" cy="78" r="52" fill="none" stroke={gold} strokeWidth="1" opacity="0.3" />

      {/* Crown / Mukut */}
      <path d="M 36 40 L 42 22 L 53 34 L 65 18 L 77 34 L 88 22 L 94 40 Z" fill={gold} />
      <line x1="36" y1="40" x2="94" y2="40" stroke={gold} strokeWidth="2.5" />
      <circle cx="42" cy="23" r="5" fill="#E53935" /><circle cx="65" cy="19" r="6" fill="#FF6D00" /><circle cx="88" cy="23" r="5" fill="#E53935" />
      {[45,54,65,76,85].map(x => <circle key={x} cx={x} cy="39" r="2.5" fill={light} opacity="0.7" />)}
      {/* Crown jewel accents */}
      <path d="M 36 40 Q 65 48 94 40" stroke={gold} strokeWidth="1" fill="none" opacity="0.6" />

      {/* Left ear */}
      <ellipse cx="20" cy="72" rx="17" ry="26" fill={skin} /><ellipse cx="21" cy="72" rx="11" ry="18" fill={skinL} opacity="0.7" />
      {/* Right ear */}
      <ellipse cx="110" cy="72" rx="17" ry="26" fill={skin} /><ellipse cx="109" cy="72" rx="11" ry="18" fill={skinL} opacity="0.7" />

      {/* Head */}
      <ellipse cx="65" cy="76" rx="40" ry="40" fill={skin} />
      <ellipse cx="65" cy="68" rx="30" ry="22" fill={skinL} opacity="0.45" />

      {/* Third eye */}
      <ellipse cx="65" cy="59" rx="6" ry="7" fill={gold} opacity="0.85" /><circle cx="65" cy="59" r="3" fill="#E91E63" />

      {/* Eyes */}
      <ellipse cx="49" cy="72" rx="8" ry="7" fill="white" /><ellipse cx="81" cy="72" rx="8" ry="7" fill="white" />
      <circle cx="50" cy="72" r="5" fill="#1A1A1A" /><circle cx="82" cy="72" r="5" fill="#1A1A1A" />
      <circle cx="51.5" cy="70.5" r="2" fill="white" /><circle cx="83.5" cy="70.5" r="2" fill="white" />

      {/* Tilak mark */}
      <path d="M 58 52 C 62 48 68 48 72 52" stroke={gold} strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="65" cy="84" rx="11" ry="9" fill="#E8954A" />

      {/* Trunk curling to the right (auspicious) */}
      <path d="M 61 92 C 56 100 50 106 48 115 C 46 124 56 130 67 127 C 76 124 80 117 75 111"
        stroke="#C76E10" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M 61 92 C 56 100 50 106 48 115 C 46 124 56 130 67 127 C 76 124 80 117 75 111"
        stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="75" cy="111" rx="6" ry="4" fill="#C76E10" opacity="0.7" transform="rotate(-20 75 111)" />

      {/* Broken left tusk */}
      <path d="M 36 88 L 16 118 L 25 122 L 40 96" fill={tusk} />
      <path d="M 16 118 L 19 125 L 26 121 Z" fill="#E0E0A0" />
      {/* Full right tusk */}
      <path d="M 94 88 L 116 122 L 108 126 L 92 96" fill={tusk} />

      {/* Necklace */}
      <path d="M 34 90 Q 65 105 96 90" stroke={gold} strokeWidth="2" fill="none" opacity="0.8" />
      {[40,50,65,80,90].map(x => <circle key={x} cx={x} cy={x===65?104:99} r="3" fill={gold} opacity="0.85" />)}

      {/* Pot belly body */}
      <ellipse cx="65" cy="144" rx="24" ry="15" fill={skin} opacity="0.75" />

      {/* Upper arms */}
      <path d="M 28 84 C 16 96 14 108 22 114" stroke={skin} strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M 102 84 C 114 96 116 108 108 114" stroke={skin} strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Modak (sweet) in right hand */}
      <ellipse cx="108" cy="116" rx="9" ry="10" fill="#FF8F00" /><ellipse cx="108" cy="112" rx="6" ry="4" fill="#FFB300" opacity="0.7" />
      {/* Lotus in left hand */}
      {[0,72,144,216,288].map(a => <ellipse key={a} cx={22} cy={116} rx="4" ry="9" fill="#E91E63" opacity="0.75" transform={`rotate(${a} 22 116) translate(0,-10)`} />)}
      <circle cx="22" cy="116" r="5" fill={gold} opacity="0.8" />
    </svg>
  );
}

function RadhaKrishnaSVG({ gold }: { gold: string }) {
  // Radha-Krishna couple — Krishna with flute & peacock feather, Radha with lotus
  return (
    <svg viewBox="0 0 210 155" width="210" height="155">
      {/* Shared divine halo backdrop */}
      <ellipse cx="105" cy="78" rx="90" ry="68" fill={gold} opacity="0.07" />
      <ellipse cx="105" cy="78" rx="84" ry="62" fill="none" stroke={gold} strokeWidth="1" opacity="0.3" />

      {/* ── KRISHNA (left) ── */}
      {/* Individual halo */}
      <circle cx="72" cy="48" r="30" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.55" />
      <circle cx="72" cy="48" r="25" fill={gold} opacity="0.1" />
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const rad = a*Math.PI/180, r=28, R=32;
        return <line key={i} x1={72+r*Math.cos(rad)} y1={48+r*Math.sin(rad)} x2={72+R*Math.cos(rad)} y2={48+R*Math.sin(rad)} stroke={gold} strokeWidth="1.2" opacity="0.4"/>;
      })}

      {/* Peacock feather crown */}
      <path d="M 58 22 C 55 10 65 4 72 7 C 79 4 89 10 86 22 Z" fill="#1565C0" opacity="0.85" />
      <ellipse cx="72" cy="11" rx="7" ry="10" fill="#2E7D32" opacity="0.85" />
      <ellipse cx="72" cy="11" rx="4.5" ry="6.5" fill="#1565C0" />
      <ellipse cx="72" cy="9" rx="2.5" ry="4" fill="#0288D1" />
      <circle cx="72" cy="8" r="2" fill="#FFD700" opacity="0.9" />
      {/* Feather eye rings */}
      {[-4,0,4].map(dx => <circle key={dx} cx={72+dx} cy={12} r="1.5" fill="#FFB300" opacity="0.7" />)}

      {/* Krishna head — blue/indigo skin */}
      <ellipse cx="72" cy="46" rx="17" ry="19" fill="#3949AB" />
      <ellipse cx="72" cy="40" rx="13" ry="10" fill="#5C6BC0" opacity="0.5" />
      {/* Bindi */}<circle cx="72" cy="34" r="3" fill={gold} opacity="0.85" />
      {/* Eyes */}
      <ellipse cx="64" cy="44" rx="5.5" ry="5" fill="white" opacity="0.9" /><ellipse cx="80" cy="44" rx="5.5" ry="5" fill="white" opacity="0.9" />
      <circle cx="64.5" cy="44" r="3" fill="#1A1A1A" /><circle cx="80.5" cy="44" r="3" fill="#1A1A1A" />
      <circle cx="65.5" cy="43" r="1.2" fill="white" /><circle cx="81.5" cy="43" r="1.2" fill="white" />
      {/* Smile */}<path d="M 67 51 Q 72 55 77 51" stroke="#FFF9C4" strokeWidth="1.2" fill="none" />

      {/* Body — yellow/golden dhoti */}
      <ellipse cx="72" cy="68" rx="15" ry="8" fill="#F57F17" />
      <path d="M 58 65 C 56 80 55 105 57 130 L 66 130 C 64 108 64 82 65 66 Z" fill="#F57F17" />
      <path d="M 86 65 C 88 80 89 105 87 130 L 78 130 C 80 108 80 82 79 66 Z" fill="#F57F17" />
      <path d="M 56 65 Q 72 78 88 65" stroke={gold} strokeWidth="1.2" fill="none" opacity="0.7" />

      {/* Flute */}
      <path d="M 56 62 C 59 52 66 40 74 30" stroke="#6D4C41" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {[0,1,2,3,4].map(i => {
        const t = i/4, x = 56+t*(74-56), y = 62+t*(30-62);
        return <circle key={i} cx={x} cy={y} r="1.8" fill="#3E2723" opacity="0.8" />;
      })}
      {/* Fingers on flute */}
      <path d="M 56 62 C 54 58 50 57 52 63" stroke="#3949AB" strokeWidth="2" fill="none" />

      {/* ── RADHA (right) ── */}
      {/* Individual halo */}
      <circle cx="138" cy="48" r="30" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.55" />
      <circle cx="138" cy="48" r="25" fill={gold} opacity="0.1" />
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const rad=a*Math.PI/180, r=28, R=32;
        return <line key={i} x1={138+r*Math.cos(rad)} y1={48+r*Math.sin(rad)} x2={138+R*Math.cos(rad)} y2={48+R*Math.sin(rad)} stroke={gold} strokeWidth="1.2" opacity="0.4"/>;
      })}

      {/* Radha's ornate crown */}
      <path d="M 126 22 L 130 10 L 138 18 L 146 10 L 150 22 Z" fill={gold} opacity="0.9" />
      <circle cx="130" cy="11" r="3.5" fill="#E91E63" /><circle cx="138" cy="14" r="4" fill="#AD1457" /><circle cx="146" cy="11" r="3.5" fill="#E91E63" />
      {/* Flowers in hair */}
      {[0,60,120,180,240,300].map(a => <ellipse key={a} cx={138} cy={20} rx="2.5" ry="5" fill="#E91E63" opacity="0.7" transform={`rotate(${a} 138 20) translate(0,-7)`}/>)}
      <circle cx="138" cy="20" r="3" fill={gold} opacity="0.85" />

      {/* Radha head — warm fair skin */}
      <ellipse cx="138" cy="46" rx="17" ry="19" fill="#FFCCBC" />
      <ellipse cx="138" cy="40" rx="13" ry="10" fill="#FFE0B2" opacity="0.5" />
      {/* Bindi */}<circle cx="138" cy="34" r="3.5" fill="#E91E63" />
      {/* Eyes */}
      <ellipse cx="130" cy="44" rx="5.5" ry="5" fill="white" opacity="0.9" /><ellipse cx="146" cy="44" rx="5.5" ry="5" fill="white" opacity="0.9" />
      <circle cx="130.5" cy="44" r="3" fill="#1A1A1A" /><circle cx="146.5" cy="44" r="3" fill="#1A1A1A" />
      <circle cx="131.5" cy="43" r="1.2" fill="white" /><circle cx="147.5" cy="43" r="1.2" fill="white" />
      {/* Smile */}<path d="M 133 51 Q 138 55 143 51" stroke="#E91E63" strokeWidth="1.2" fill="none" />
      {/* Nose ornament */}<circle cx="138" cy="50" r="2.5" fill={gold} opacity="0.8" />

      {/* Body — pink/crimson sari */}
      <ellipse cx="138" cy="68" rx="15" ry="8" fill="#C62828" />
      <path d="M 124 65 C 122 80 121 105 123 130 L 132 130 C 130 108 130 82 131 66 Z" fill="#C62828" />
      <path d="M 152 65 C 154 80 155 105 153 130 L 144 130 C 146 108 146 82 145 66 Z" fill="#B71C1C" />
      {/* Gold sari border */}
      <path d="M 122 65 Q 138 78 154 65" stroke={gold} strokeWidth="1.2" fill="none" opacity="0.7" />

      {/* Lotus in Radha's hand */}
      <path d="M 152 75 C 158 65 165 58 168 50" stroke="#FFCCBC" strokeWidth="7" fill="none" strokeLinecap="round" />
      {[0,72,144,216,288].map(a => <ellipse key={a} cx={168} cy={50} rx="4" ry="9" fill="#F48FB1" opacity="0.8" transform={`rotate(${a} 168 50) translate(0,-10)`}/>)}
      <circle cx="168" cy="50" r="5" fill={gold} opacity="0.8" />

      {/* Linked hands in center */}
      <path d="M 88 80 Q 105 92 122 80" stroke={gold} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="88" cy="80" r="4" fill={gold} opacity="0.6" />
      <circle cx="122" cy="80" r="4" fill={gold} opacity="0.6" />

      {/* Decorative bottom vine */}
      <path d="M 20 140 Q 105 155 190 140" stroke={gold} strokeWidth="1.5" fill="none" opacity="0.45" />
      {[40,70,105,140,170].map(x => <g key={x} transform={`translate(${x},140)`}><circle r="2.5" fill={gold} opacity="0.5" /></g>)}
    </svg>
  );
}

// ─── Radha-Krishna Style 2: Elegant Silhouette in Circle ─────────────────────
// Inspired by the clean black silhouette art (image 2) — crescent arc, flowing hair, lotus

function RKSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 195" width="200" height="195">
      {/* Moon crescent arc (large, left background) */}
      <path d="M 22 105 C 18 58 46 20 92 16 C 52 20 24 62 24 105 C 24 148 55 175 90 175"
        fill="none" stroke={color} strokeWidth="5" opacity="0.4" strokeLinecap="round" />
      <path d="M 28 108 C 25 68 50 34 88 30"
        fill="none" stroke={color} strokeWidth="2" opacity="0.2" strokeLinecap="round" />

      {/* Lotus at bottom center */}
      <g transform="translate(100,188)">
        {[0,36,72,108,144,180,216,252,288,324].map(a => (
          <ellipse key={a} rx="4.5" ry="12" fill={color} opacity="0.8"
            transform={`rotate(${a}) translate(0,-13)`} />
        ))}
        <circle r="8" fill={color} /><circle r="4" fill="white" opacity="0.3" />
      </g>

      {/* ── RADHA — left, flowing long hair ── */}
      {/* Long flowing hair — the defining element */}
      <path d="M 54 42 C 42 60 34 88 30 118 C 26 142 27 165 28 185"
        stroke={color} strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 55 43 C 45 64 38 92 34 120 C 30 145 31 168 33 185"
        stroke={color} strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M 56 45 C 48 68 43 96 40 124"
        stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.35" />

      {/* Radha head (profile, facing right) */}
      <ellipse cx="68" cy="33" rx="22" ry="24" fill={color} />
      {/* Nose profile */}
      <path d="M 86 27 C 93 25 96 32 92 38 C 89 42 83 43 81 40" fill={color} opacity="0.9" />
      {/* Flower crown */}
      {[50,58,66,74,82].map((x,i) => (
        <g key={x} transform={`translate(${x},${14-Math.abs(i-2)*3})`}>
          {[0,72,144,216,288].map(a => <ellipse key={a} rx="2.5" ry="6" fill={color} opacity="0.8" transform={`rotate(${a}) translate(0,-7)`}/>)}
          <circle r="3.5" fill={color} />
        </g>
      ))}
      {/* Earring drop */}
      <path d="M 48 36 L 46 44 L 48 52" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="47" cy="53" r="3.5" fill={color} />
      {/* Radha body/sari */}
      <path d="M 44 56 C 36 74 30 96 28 124 C 26 150 27 172 28 188 L 70 188 C 70 172 68 150 68 124 C 68 96 68 74 68 56 Z"
        fill={color} opacity="0.8" />
      {/* Sari drape lines */}
      <path d="M 58 60 C 50 68 40 72 34 76" stroke="white" strokeWidth="1.5" fill="none" opacity="0.12" />
      <path d="M 64 70 C 55 78 44 82 36 86" stroke="white" strokeWidth="1.2" fill="none" opacity="0.1" />
      {/* Necklace */}
      <path d="M 46 60 Q 58 70 70 60" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />

      {/* ── KRISHNA — right, peacock feather, flute ── */}
      {/* Hair/bun at top */}
      <path d="M 134 38 C 128 24 138 14 148 17 C 160 20 164 32 155 40" fill={color} opacity="0.9" />

      {/* Peacock feather — VERY prominent, tall */}
      <path d="M 152 20 C 156 10 162 4 163 -6 C 166 4 165 14 158 20"
        fill={color} opacity="0.95" />
      {/* Feather plume */}
      <path d="M 163 -6 C 168 -16 178 -21 180 -13 C 174 -7 167 -5 163 -6 Z" fill={color} opacity="0.9" />
      {/* Feather eye */}
      <ellipse cx="172" cy="-15" rx="6.5" ry="8.5" fill={color} opacity="0.8" transform="rotate(12 172 -15)" />
      <circle cx="172" cy="-15" r="3.5" fill="white" opacity="0.4" />
      <circle cx="172" cy="-15" r="2" fill={color} />
      {/* Feather detail lines */}
      {[-18,-12,-6,0].map((y,i) => (
        <path key={i} d={`M ${163+i} ${y} L ${178-i*1.5} ${y-3}`} stroke="white" strokeWidth="0.7" opacity="0.25" />
      ))}

      {/* Krishna head (profile, facing left) */}
      <ellipse cx="132" cy="33" rx="22" ry="24" fill={color} />
      {/* Nose profile (facing left) */}
      <path d="M 114 27 C 107 25 104 32 108 38 C 111 42 117 43 119 40" fill={color} opacity="0.9" />
      {/* Crown/mukut */}
      <path d="M 120 16 L 125 6 L 132 13 L 138 6 L 145 13 L 150 6 L 154 16 Z" fill={color} />
      {[123,130,138,145,152].map(x => <circle key={x} cx={x} cy="16" r="2.2" fill="white" opacity="0.2" />)}
      {/* Earring */}
      <path d="M 152 36 L 154 44 L 152 52" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="153" cy="53" r="3.5" fill={color} />
      {/* Krishna body */}
      <path d="M 114 56 C 120 74 122 96 122 124 C 122 150 120 172 120 188 L 164 188 C 164 172 164 150 166 124 C 168 96 168 74 162 56 Z"
        fill={color} opacity="0.8" />
      {/* Dhoti folds */}
      <path d="M 122 88 C 135 98 150 98 162 88" stroke="white" strokeWidth="1.5" fill="none" opacity="0.12" />

      {/* FLUTE — the connecting element across the composition */}
      <path d="M 70 68 C 82 58 96 50 112 45 C 126 40 136 40 146 40"
        stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.95" />
      {/* Flute holes */}
      {[80,90,100,110,120,132].map((x,i) => {
        const y = 68 - i * 4.5;
        return <circle key={i} cx={x} cy={y} r="2.5" fill="white" opacity="0.25" />;
      })}
      {/* Fingers on flute */}
      <path d="M 70 68 C 68 63 63 62 65 68" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* Necklace on Krishna */}
      <path d="M 120 62 Q 132 72 144 62" stroke="white" strokeWidth="1.5" fill="none" opacity="0.18" />
      {[122,132,142].map(x => <circle key={x} cx={x} cy={x===132?71:66} r="2.5" fill="white" opacity="0.18" />)}

      {/* Small flowers at feet/ground level */}
      {[60,80,100,120,140].map((x,i) => (
        <g key={x} transform={`translate(${x},178)`}>
          {[0,90,180,270].map(a => <ellipse key={a} rx="2" ry="4" fill={color} opacity="0.5" transform={`rotate(${a}) translate(0,-5)`}/>)}
          <circle r="2.5" fill={color} opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

// ─── Radha-Krishna Style 3: Colorful Flat Illustration ──────────────────────
// Inspired by images 1, 9 (orange/color silhouette standing couple)

function RKColorfulCouple({ gold }: { gold: string }) {
  const krishnaBlue = "#3949AB", krishnaBlueL = "#7986CB";
  const radhaRed = "#C62828", radhaRedL = "#EF9A9A";
  const skin = "#FFCCBC", skinK = "#5C6BC0";
  return (
    <svg viewBox="0 0 230 185" width="230" height="185">
      {/* Shared aureole */}
      <ellipse cx="115" cy="85" rx="100" ry="75" fill={gold} opacity="0.06" />
      <ellipse cx="115" cy="85" rx="95" ry="70" fill="none" stroke={gold} strokeWidth="1" opacity="0.25" />

      {/* ── KRISHNA (left, playing flute, standing tribhanga) ── */}
      {/* Krishna halo */}
      <circle cx="78" cy="42" r="32" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.5" />
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const r=30, R=34, rad=a*Math.PI/180;
        return <line key={i} x1={78+r*Math.cos(rad)} y1={42+r*Math.sin(rad)} x2={78+R*Math.cos(rad)} y2={42+R*Math.sin(rad)} stroke={gold} strokeWidth="1.2" opacity="0.35"/>;
      })}

      {/* Krishna peacock feather crown */}
      <path d="M 64 20 C 60 8 70 2 78 5 C 86 2 96 8 92 20 Z" fill={krishnaBlue} />
      <path d="M 78 10 C 75 2 80 -4 82 -2 C 84 4 82 10 78 10 Z" fill="#1B5E20" opacity="0.9" />
      {/* Peacock feather plume */}
      <path d="M 82 -2 C 87 -10 96 -14 98 -8 C 93 -3 87 -1 82 -2 Z" fill="#1B5E20" opacity="0.85" />
      <ellipse cx="90" cy="-10" rx="5" ry="7" fill="#2E7D32" transform="rotate(15 90 -10)" />
      <circle cx="90" cy="-10" r="3.5" fill="#00BCD4" opacity="0.7" />
      <circle cx="90" cy="-10" r="2" fill="#FFD700" opacity="0.9" />
      {/* Crown band */}
      <rect x="62" y="20" width="32" height="6" rx="2" fill={gold} opacity="0.85" />
      <circle cx="68" cy="23" r="2.5" fill="#E53935" /><circle cx="78" cy="23" r="3" fill="#FF6D00" /><circle cx="88" cy="23" r="2.5" fill="#E53935" />

      {/* Krishna head */}
      <ellipse cx="78" cy="44" rx="18" ry="20" fill={skinK} />
      {/* Tilak */}<path d="M 71 35 C 75 31 81 31 85 35" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="70" cy="42" rx="5" ry="4.5" fill="white" opacity="0.9" /><ellipse cx="86" cy="42" rx="5" ry="4.5" fill="white" opacity="0.9" />
      <circle cx="70.5" cy="42" r="3" fill="#1A1A1A" /><circle cx="86.5" cy="42" r="3" fill="#1A1A1A" />
      <circle cx="71.5" cy="41" r="1.2" fill="white" /><circle cx="87.5" cy="41" r="1.2" fill="white" />
      {/* Smile */}<path d="M 73 50 Q 78 54 83 50" stroke="#FFF9C4" strokeWidth="1.3" fill="none" />

      {/* Flute arms */}
      <path d="M 60 55 C 48 50 36 40 30 32" stroke={skinK} strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M 96 50 C 104 45 110 42 115 40" stroke={skinK} strokeWidth="9" fill="none" strokeLinecap="round" />

      {/* Flute */}
      <path d="M 30 32 C 45 26 65 22 90 20" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 30 32 C 45 26 65 22 90 20" stroke="#D4A017" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
      {[38,50,62,74,84].map((x,i) => <circle key={i} cx={x} cy={32-i*2} r="2.5" fill="#5D4037" opacity="0.8" />)}

      {/* Krishna body — yellow dhoti (tribhanga bend) */}
      <ellipse cx="78" cy="64" rx="16" ry="8" fill="#F57F17" />
      <path d="M 63 62 C 60 80 58 105 60 130 L 68 130 C 66 105 67 80 68 62 Z" fill="#F57F17" />
      <path d="M 93 60 C 96 78 97 103 95 128 L 87 128 C 89 103 88 78 87 60 Z" fill="#F57F17" />
      {/* Dhoti folds */}
      <path d="M 60 90 Q 78 98 95 90" stroke={gold} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 61 105 Q 78 112 94 105" stroke={gold} strokeWidth="1" fill="none" opacity="0.4" />
      {/* Gold waistband */}
      <path d="M 62 64 Q 78 70 94 64" stroke={gold} strokeWidth="2.5" fill="none" />
      {[66,72,78,84,90].map(x => <circle key={x} cx={x} cy={x===78?70:67} r="2" fill={gold} opacity="0.8" />)}

      {/* Multi-strand necklace */}
      {[57,61].map((y,i) => <path key={i} d={`M 64 ${y} Q 78 ${y+8} 92 ${y}`} stroke={gold} strokeWidth={2-i*0.5} fill="none" opacity={0.8-i*0.1} />)}

      {/* ── RADHA (right, standing beside Krishna) ── */}
      {/* Radha halo */}
      <circle cx="155" cy="42" r="32" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.5" />
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const r=30, R=34, rad=a*Math.PI/180;
        return <line key={i} x1={155+r*Math.cos(rad)} y1={42+r*Math.sin(rad)} x2={155+R*Math.cos(rad)} y2={42+R*Math.sin(rad)} stroke={gold} strokeWidth="1.2" opacity="0.35"/>;
      })}

      {/* Radha crown */}
      <path d="M 143 22 L 147 12 L 155 20 L 163 12 L 167 22 Z" fill={gold} />
      <circle cx="147" cy="13" r="3.5" fill="#E91E63" /><circle cx="155" cy="17" r="4.5" fill="#AD1457" /><circle cx="163" cy="13" r="3.5" fill="#E91E63" />
      {/* Flowers in Radha's hair */}
      {[142,150,158,166].map((x,i) => (
        <g key={x} transform={`translate(${x},${8-i%2*4})`}>
          {[0,72,144,216,288].map(a => <ellipse key={a} rx="2.5" ry="5.5" fill={i%2===0?"#E91E63":"#FF9800"} opacity="0.7" transform={`rotate(${a}) translate(0,-6.5)`}/>)}
          <circle r="3" fill={gold} opacity="0.85" />
        </g>
      ))}
      {/* Long wavy hair */}
      <path d="M 144 30 C 136 46 130 70 128 100 C 126 125 128 150 130 175"
        stroke="#5D4037" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M 145 32 C 138 50 133 75 132 105"
        stroke="#795548" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Radha head */}
      <ellipse cx="155" cy="44" rx="18" ry="20" fill={skin} />
      {/* Bindi */}<circle cx="155" cy="32" r="3.5" fill="#E91E63" />
      {/* Eyes */}
      <ellipse cx="147" cy="42" rx="5" ry="4.5" fill="white" opacity="0.9" /><ellipse cx="163" cy="42" rx="5" ry="4.5" fill="white" opacity="0.9" />
      <circle cx="147.5" cy="42" r="3" fill="#1A1A1A" /><circle cx="163.5" cy="42" r="3" fill="#1A1A1A" />
      <circle cx="148.5" cy="41" r="1.2" fill="white" /><circle cx="164.5" cy="41" r="1.2" fill="white" />
      {/* Nose ornament */}<circle cx="155" cy="50" r="2.5" fill={gold} opacity="0.8" />
      {/* Smile */}<path d="M 150 53 Q 155 57 160 53" stroke="#E57373" strokeWidth="1.3" fill="none" />

      {/* Radha body — red/orange sari */}
      <ellipse cx="155" cy="64" rx="16" ry="8" fill={radhaRed} />
      <path d="M 140 62 C 138 80 136 105 138 130 L 148 130 C 146 105 146 80 148 62 Z" fill={radhaRed} />
      <path d="M 170 62 C 172 80 174 105 172 130 L 162 130 C 164 105 164 80 162 62 Z" fill="#B71C1C" />
      {/* Gold sari border */}
      <path d="M 138 62 Q 155 72 172 62" stroke={gold} strokeWidth="2" fill="none" />
      {/* Pallu drape */}
      <path d="M 170 65 C 178 70 182 80 180 95" stroke={radhaRed} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Necklace */}
      {[57,62].map((y,i) => <path key={i} d={`M 142 ${y} Q 155 ${y+8} 168 ${y}`} stroke={gold} strokeWidth={2-i*0.4} fill="none" opacity={0.8-i*0.15} />)}

      {/* Touching hands in center */}
      <path d="M 96 72 Q 125 84 140 74" stroke={gold} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="96" cy="72" rx="6" ry="5" fill={skinK} />
      <ellipse cx="140" cy="74" rx="6" ry="5" fill={skin} />

      {/* Grass/ground with flowers */}
      <path d="M 30 165 Q 115 175 200 165" fill="#2E7D32" opacity="0.2" />
      {[45,65,90,115,140,165,185].map((x,i) => (
        <g key={x} transform={`translate(${x},163)`}>
          {[0,72,144,216,288].map(a => <ellipse key={a} rx="2.5" ry="6" fill={["#E91E63","#FF9800","#2196F3","#9C27B0","#4CAF50"][i%5]} opacity="0.8" transform={`rotate(${a}) translate(0,-7)`}/>)}
          <circle r="3.5" fill={gold} opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

// ─── Radha-Krishna Style 4: Profile Faces Back-to-Back ──────────────────────
// Inspired by images 4, 6, 8 — side profiles with flowers, elegant line art feel

function RKProfileFaces({ gold, primary }: { gold: string; primary: string }) {
  return (
    <svg viewBox="0 0 240 170" width="240" height="170">
      {/* Background circle halo */}
      <circle cx="120" cy="82" r="75" fill={gold} opacity="0.07" />
      <circle cx="120" cy="82" r="70" fill="none" stroke={gold} strokeWidth="1" opacity="0.22" />

      {/* ── RADHA (left, profile facing right) ── */}

      {/* Radha's elaborate flower crown */}
      {[38,50,62,74,86].map((x,i) => (
        <g key={x} transform={`translate(${x},${28-Math.abs(i-2)*5})`}>
          {[0,60,120,180,240,300].map(a => (
            <ellipse key={a} rx="3" ry="7" fill={["#E91E63","#FF9800","#9C27B0","#E91E63","#F44336"][i]} opacity="0.8"
              transform={`rotate(${a}) translate(0,-8)`} />
          ))}
          <circle r="4" fill={gold} opacity="0.9" />
        </g>
      ))}
      {/* Pearl garland in hair */}
      {[40,50,60,70,80,90].map(x => <circle key={x} cx={x} cy={38-Math.abs(x-65)*0.05} r="2.5" fill="white" opacity="0.75" />)}

      {/* Radha hair (long braid going down) */}
      <path d="M 48 45 C 40 62 36 88 34 116 C 32 138 33 160 34 170"
        stroke="#5D4037" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M 50 47 C 44 66 41 94 40 122"
        stroke="#795548" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Braid texture */}
      {[60,74,88,102,116].map((y,i) => (
        <path key={y} d={`M ${36} ${y} C ${38} ${y-3} ${44} ${y-3} ${44} ${y}`}
          stroke="#8D6E63" strokeWidth="2" fill="none" opacity="0.4" />
      ))}

      {/* Radha face profile (facing right) */}
      <ellipse cx="72" cy="72" rx="26" ry="28" fill="#FFCCBC" />
      {/* Forehead profile */}
      <path d="M 90 55 C 98 52 101 60 98 68" fill="#FFCCBC" />
      {/* Nose profile */}
      <path d="M 98 68 C 102 70 103 78 98 82" fill="#FFCCBC" />
      <ellipse cx="99" cy="73" rx="5" ry="4" fill="#FFAA80" />
      {/* Nose ornament (nath) */}
      <path d="M 96 76 C 96 80 100 82 103 80" stroke={gold} strokeWidth="2" fill="none" />
      <circle cx="103" cy="80" r="3" fill={gold} opacity="0.8" />

      {/* Radha eye (profile, with kajal) */}
      <path d="M 82 65 C 88 60 98 62 97 69 C 96 74 88 75 83 72 C 79 70 79 67 82 65 Z" fill="white" />
      <ellipse cx="91" cy="68" rx="4.5" ry="4" fill="#1A1A1A" />
      <circle cx="93" cy="67" r="1.8" fill="white" opacity="0.9" />
      {/* Extended kajal */}
      <path d="M 97 69 L 104 66" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Bindi */}
      <circle cx="82" cy="60" r="4" fill="#E91E63" />
      {/* Tikka/maang */}
      <path d="M 68 42 L 82 60" stroke={gold} strokeWidth="1.5" />
      <circle cx="68" cy="42" r="3.5" fill={gold} opacity="0.9" />

      {/* Smile */}
      <path d="M 90 84 Q 98 90 94 96" stroke="#E57373" strokeWidth="1.8" fill="none" />

      {/* Ornate earring */}
      <path d="M 50 68 L 48 76 L 50 84 L 48 92 L 52 96" stroke={gold} strokeWidth="2" fill="none" />
      {[76,84,92].map(y => <circle key={y} cx="49" cy={y} r="2.8" fill={gold} opacity="0.85" />)}
      <path d="M 46 96 Q 50 104 54 96" stroke={gold} strokeWidth="1.5" fill={gold} opacity="0.6" />

      {/* Multi-strand necklace */}
      {[102,107,113].map((y,i) => (
        <path key={i} d={`M 54 ${y} Q 68 ${y+9} 82 ${y}`} stroke={gold} strokeWidth={2.5-i*0.4} fill="none" opacity={0.85-i*0.1} />
      ))}
      {[57,64,72,80].map(x => <circle key={x} cx={x} cy={x===68||x===72?120:115} r="3" fill={gold} opacity="0.8" />)}

      {/* ── KRISHNA (right, profile facing left) ── */}

      {/* Krishna's elaborate gold crown */}
      <path d="M 152 28 L 157 16 L 166 24 L 175 14 L 180 24 L 188 16 L 193 28 Z" fill={gold} />
      <circle cx="157" cy="17" r="4" fill="#E53935" /><circle cx="175" cy="16" r="5" fill="#FF6D00" /><circle cx="193" cy="17" r="4" fill="#E53935" />
      <path d="M 152 28 Q 172 36 193 28" stroke={gold} strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* Peacock feather rising from crown */}
      <path d="M 190 18 C 196 8 202 2 203 -8" stroke={gold} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Feather branches */}
      {[-8,-3,2,7].map((y,i) => (
        <path key={i} d={`M ${203+i*0.5} ${y} L ${210+i} ${y-3} M ${203+i*0.5} ${y} L ${196+i} ${y-3}`}
          stroke={gold} strokeWidth="1.5" fill="none" opacity={0.7-i*0.1} />
      ))}
      {/* Feather eye */}
      <ellipse cx="206" cy="-10" rx="6" ry="9" fill={gold} opacity="0.7" transform="rotate(5 206 -10)" />
      <circle cx="206" cy="-10" r="3.5" fill="white" opacity="0.4" />
      <circle cx="206" cy="-10" r="2" fill={gold} />

      {/* Krishna curly hair */}
      <path d="M 196 38 C 205 33 212 42 210 52 C 208 58 202 60 196 56"
        stroke="#1A237E" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.75" />
      <path d="M 194 40 C 201 36 207 44 206 52"
        stroke="#3949AB" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Krishna face profile (facing left) */}
      <ellipse cx="168" cy="72" rx="26" ry="28" fill="#5C6BC0" />
      {/* Forehead profile */}
      <path d="M 150 55 C 142 52 139 60 142 68" fill="#5C6BC0" />
      {/* Nose profile */}
      <path d="M 142 68 C 138 70 137 78 142 82" fill="#5C6BC0" />
      <ellipse cx="141" cy="73" rx="5" ry="4" fill="#7986CB" />

      {/* Krishna eye (profile) */}
      <path d="M 158 65 C 152 60 142 62 143 69 C 144 74 152 75 157 72 C 161 70 161 67 158 65 Z" fill="white" />
      <ellipse cx="149" cy="68" rx="4.5" ry="4" fill="#1A1A1A" />
      <circle cx="147" cy="67" r="1.8" fill="white" opacity="0.9" />
      {/* Extended kajal */}
      <path d="M 143 69 L 136 66" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Tilak - three horizontal lines */}
      <line x1="158" y1="57" x2="176" y2="57" stroke="white" strokeWidth="2" opacity="0.85" />
      <line x1="160" y1="60" x2="174" y2="60" stroke="white" strokeWidth="1.5" opacity="0.7" />

      {/* Smile */}
      <path d="M 150 84 Q 142 90 146 96" stroke="#FFF9C4" strokeWidth="1.8" fill="none" />

      {/* Ornate earring */}
      <path d="M 190 68 L 192 76 L 190 84 L 192 92 L 188 96" stroke={gold} strokeWidth="2" fill="none" />
      {[76,84,92].map(y => <circle key={y} cx="191" cy={y} r="2.8" fill={gold} opacity="0.85" />)}
      <path d="M 186 96 Q 190 104 194 96" stroke={gold} strokeWidth="1.5" fill={gold} opacity="0.6" />

      {/* Multi-strand necklace on Krishna */}
      {[100,106,112].map((y,i) => (
        <path key={i} d={`M ${156} ${y} Q ${172} ${y+9} ${188} ${y}`} stroke={gold} strokeWidth={2.5-i*0.4} fill="none" opacity={0.85-i*0.1} />
      ))}

      {/* Flowers filling the center space */}
      {[98,108,120,132,142].map((x,i) => (
        <g key={x} transform={`translate(${x},${48+Math.sin(i*1.5)*8})`}>
          {[0,60,120,180,240,300].map(a => (
            <ellipse key={a} rx="3" ry="7" fill={["#E91E63","#FF9800","#9C27B0","#F44336","#2196F3"][i]}
              opacity="0.75" transform={`rotate(${a}) translate(0,-8)`} />
          ))}
          <circle r="4" fill={gold} opacity="0.9" />
        </g>
      ))}
      {/* Leaves between flowers */}
      {[103,115,127,137].map((x,i) => (
        <ellipse key={x} cx={x} cy={55+i*2} rx="5" ry="10" fill="#2E7D32" opacity="0.5"
          transform={`rotate(${-20+i*15} ${x} ${55+i*2})`} />
      ))}
    </svg>
  );
}

// ─── Radha-Krishna Style 5: Cute Chibi / Folk Art Standing ──────────────────
// Inspired by images 3, 7, 9 — simple cute folk-art proportions

function RKCuteStyle({ gold, primary }: { gold: string; primary: string }) {
  const kBlue = "#3F51B5", kSkin = "#5C6BC0";
  const rSkin = "#FFCCBC", rDress = "#E91E63";
  return (
    <svg viewBox="0 0 200 185" width="200" height="185">
      {/* Simple aureole */}
      <circle cx="100" cy="80" r="72" fill={gold} opacity="0.07" />
      <circle cx="100" cy="80" r="67" fill="none" stroke={gold} strokeWidth="1.2" opacity="0.25" />

      {/* ── KRISHNA (left) — cute proportions ── */}

      {/* Peacock feather — iconic + simple */}
      <path d="M 72 18 C 70 9 74 4 76 2 C 78 4 81 9 79 18 Z" fill="#1B5E20" opacity="0.9" />
      <ellipse cx="76" cy="4" rx="4" ry="6" fill="#1565C0" opacity="0.85" />
      <circle cx="76" cy="3" r="2.5" fill="#00BCD4" /><circle cx="76" cy="3" r="1.2" fill={gold} />

      {/* Krishna cute head - big round */}
      <circle cx="76" cy="40" r="26" fill={kSkin} />
      {/* Crown band */}
      <path d="M 54 30 L 57 20 L 65 28 L 76 22 L 87 28 L 95 20 L 98 30 Z" fill={gold} />
      {[57,68,76,84,95].map(x => <circle key={x} cx={x} cy="30" r="2.5" fill="white" opacity="0.5" />)}
      {/* Big cute eyes */}
      <circle cx="68" cy="40" r="7" fill="white" opacity="0.95" />
      <circle cx="84" cy="40" r="7" fill="white" opacity="0.95" />
      <circle cx="68" cy="41" r="5" fill="#1A1A1A" /><circle cx="84" cy="41" r="5" fill="#1A1A1A" />
      <circle cx="70" cy="39" r="2" fill="white" /><circle cx="86" cy="39" r="2" fill="white" />
      {/* Lashes */}
      {[-2,0,2].map(dx => <line key={dx} x1={68+dx} y1="34" x2={66+dx} y2="30" stroke="#1A1A1A" strokeWidth="1.2" />)}
      {[-2,0,2].map(dx => <line key={dx} x1={84+dx} y1="34" x2={82+dx} y2="30" stroke="#1A1A1A" strokeWidth="1.2" />)}
      {/* Tilak */}
      <path d="M 71 30 C 73 27 79 27 81 30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Chubby cheeks blush */}
      <circle cx="60" cy="48" r="7" fill="#FF8A80" opacity="0.3" />
      <circle cx="92" cy="48" r="7" fill="#FF8A80" opacity="0.3" />
      {/* Smile */}
      <path d="M 68 52 Q 76 60 84 52" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Krishna body — short cute proportions */}
      <ellipse cx="76" cy="80" rx="18" ry="10" fill="#F57F17" />
      <rect x="58" y="78" width="36" height="40" rx="6" fill="#F57F17" />
      {/* Dhoti bottom */}
      <path d="M 58 118 Q 76 128 94 118 L 98 155 L 54 155 Z" fill="#F57F17" />
      {/* Gold waistband */}
      <path d="M 58 78 Q 76 86 94 78" stroke={gold} strokeWidth="2.5" fill="none" />

      {/* Flute arms */}
      <path d="M 58 82 C 44 76 32 66 24 58" stroke={kSkin} strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M 94 80 C 105 76 114 74 120 72" stroke={kSkin} strokeWidth="10" fill="none" strokeLinecap="round" />

      {/* Flute */}
      <path d="M 24 58 C 40 48 60 44 88 40" stroke="#8D6E63" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <path d="M 24 58 C 40 48 60 44 88 40" stroke={gold} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
      {[32,46,60,74].map((x,i) => <circle key={i} cx={x} cy={58-i*4.5} r="3" fill="#5D4037" opacity="0.85" />)}

      {/* Necklace */}
      {[68,72].map((y,i) => <path key={i} d={`M 60 ${y} Q 76 ${y+7} 92 ${y}`} stroke={gold} strokeWidth={2.5-i*0.5} fill="none" opacity={0.8-i*0.1} />)}

      {/* Krishna feet with anklets */}
      <ellipse cx="63" cy="158" rx="10" ry="6" fill={kSkin} />
      <ellipse cx="89" cy="158" rx="10" ry="6" fill={kSkin} />
      <path d="M 55 158 Q 63 164 71 158" stroke={gold} strokeWidth="1.5" fill="none" />
      <path d="M 81 158 Q 89 164 97 158" stroke={gold} strokeWidth="1.5" fill="none" />

      {/* ── RADHA (right) — cute proportions ── */}

      {/* Radha flower crown */}
      {[112,120,128,136,144].map((x,i) => (
        <g key={x} transform={`translate(${x},${20-Math.abs(i-2)*4})`}>
          {[0,60,120,180,240,300].map(a => (
            <ellipse key={a} rx="2.5" ry="6" fill={i%2===0?"#E91E63":"#FF9800"} opacity="0.8"
              transform={`rotate(${a}) translate(0,-7)`} />
          ))}
          <circle r="3.5" fill={gold} opacity="0.85" />
        </g>
      ))}

      {/* Radha long flowing hair */}
      <path d="M 116 36 C 106 55 100 80 98 110 C 96 135 96 158 96 175"
        stroke="#5D4037" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.75" />
      <path d="M 118 38 C 110 58 105 85 104 115"
        stroke="#795548" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Radha cute head */}
      <circle cx="128" cy="40" r="26" fill={rSkin} />
      {/* Bindi */}<circle cx="128" cy="27" r="4" fill="#E91E63" />
      {/* Big cute eyes */}
      <circle cx="119" cy="40" r="7" fill="white" opacity="0.95" />
      <circle cx="137" cy="40" r="7" fill="white" opacity="0.95" />
      <circle cx="119" cy="41" r="5" fill="#1A1A1A" /><circle cx="137" cy="41" r="5" fill="#1A1A1A" />
      <circle cx="121" cy="39" r="2" fill="white" /><circle cx="139" cy="39" r="2" fill="white" />
      {/* Lashes */}
      {[-2,0,2].map(dx => <line key={dx} x1={119+dx} y1="34" x2={117+dx} y2="30" stroke="#1A1A1A" strokeWidth="1.2" />)}
      {[-2,0,2].map(dx => <line key={dx} x1={137+dx} y1="34" x2={135+dx} y2="30" stroke="#1A1A1A" strokeWidth="1.2" />)}
      {/* Chubby cheeks blush */}
      <circle cx="112" cy="48" r="7" fill="#FF8A80" opacity="0.3" />
      <circle cx="144" cy="48" r="7" fill="#FF8A80" opacity="0.3" />
      {/* Smile */}
      <path d="M 120 52 Q 128 60 136 52" stroke="#E91E63" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Earring */}
      <circle cx="108" cy="44" r="4" fill={gold} opacity="0.85" />
      <path d="M 108 48 L 108 56 L 104 60 L 108 64 L 112 60 L 108 56" stroke={gold} strokeWidth="1.8" fill="none" />

      {/* Radha body / sari */}
      <ellipse cx="128" cy="80" rx="20" ry="10" fill={rDress} />
      <rect x="108" y="78" width="40" height="42" rx="6" fill={rDress} />
      {/* Sari base */}
      <path d="M 108 120 Q 128 130 148 120 L 152 158 L 104 158 Z" fill={rDress} />
      {/* Gold border */}
      <path d="M 108 78 Q 128 88 148 78" stroke={gold} strokeWidth="2.5" fill="none" />
      <path d="M 108 120 Q 128 128 148 120" stroke={gold} strokeWidth="1.5" fill="none" />
      {/* Pallu */}
      <path d="M 148 82 C 158 78 164 84 162 98" stroke={rDress} strokeWidth="10" fill="none" strokeLinecap="round" />

      {/* Necklace */}
      {[72,77].map((y,i) => <path key={i} d={`M 112 ${y} Q 128 ${y+8} 144 ${y}`} stroke={gold} strokeWidth={2.5-i*0.5} fill="none" opacity={0.8-i*0.1} />)}

      {/* Hands reaching toward Krishna */}
      <path d="M 108 86 C 100 90 94 90 88 87" stroke={rSkin} strokeWidth="9" fill="none" strokeLinecap="round" />
      <ellipse cx="88" cy="87" rx="6" ry="4.5" fill={rSkin} />

      {/* Radha feet with anklets */}
      <ellipse cx="116" cy="160" rx="10" ry="6" fill={rSkin} />
      <ellipse cx="140" cy="160" rx="10" ry="6" fill={rSkin} />
      <path d="M 108 160 Q 116 166 124 160" stroke={gold} strokeWidth="1.5" fill="none" />
      <path d="M 132 160 Q 140 166 148 160" stroke={gold} strokeWidth="1.5" fill="none" />

      {/* Ground grass with flowers */}
      {[30,55,80,100,120,145,170].map((x,i) => (
        <g key={x} transform={`translate(${x},170)`}>
          {[0,72,144,216,288].map(a => (
            <ellipse key={a} rx="2.5" ry="6" fill={["#4CAF50","#E91E63","#FF9800","#2196F3","#9C27B0"][i%5]}
              opacity="0.8" transform={`rotate(${a}) translate(0,-7)`} />
          ))}
          <circle r="3.5" fill={gold} opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

// ─── Master RK picker — now uses real uploaded images via DeityImage ──────────

function getRadhaKrishnaSVG(templateId: string, colors: { secondary: string }) {
  // All Royal templates now use actual uploaded images in a medallion frame
  return <DeityImage templateId={templateId} gold={colors.secondary} onDarkBg />;
}

function ShivaSVG({ gold }: { gold: string }) {
  // Lord Shiva — trishul, crescent moon, third eye, blue throat
  const blue = "#37474F", blueL = "#546E7A";
  return (
    <svg viewBox="0 0 130 155" width="130" height="155">
      {/* Aureole */}
      <circle cx="65" cy="78" r="56" fill={gold} opacity="0.08" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => {
        const rad=a*Math.PI/180, r=52, R=58;
        return <line key={i} x1={65+r*Math.cos(rad)} y1={78+r*Math.sin(rad)} x2={65+R*Math.cos(rad)} y2={78+R*Math.sin(rad)} stroke={gold} strokeWidth="1.5" opacity="0.3"/>;
      })}
      <circle cx="65" cy="78" r="50" fill="none" stroke={gold} strokeWidth="1" opacity="0.3" />

      {/* Matted hair (Jata) */}
      <path d="M 34 48 C 30 30 40 12 52 10 C 62 8 72 14 76 22 L 94 5 L 97 16 L 86 20 C 94 28 96 40 93 50"
        fill="#5D4037" opacity="0.9" />
      {/* Jata strands */}
      {[52,60,68,76,84].map(x => <path key={x} d={`M ${x} 18 C ${x-4} 8 ${x-1} 4 ${x} 6`} stroke="#795548" strokeWidth="2" fill="none" opacity="0.8"/>)}
      {/* Ganga flowing from hair */}
      <path d="M 35 44 C 30 56 32 68 30 80" stroke="#64B5F6" strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M 32 52 C 28 58 29 65 27 72" stroke="#90CAF9" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Crescent moon in hair */}
      <path d="M 78 18 C 90 14 96 24 90 34 C 84 26 78 26 78 18 Z" fill="#FFF9C4" opacity="0.95" />
      <path d="M 78 18 C 72 14 70 24 74 34 C 78 26 80 24 78 18 Z" fill="white" opacity="0.6" />

      {/* Third eye (prominent — Shiva's key symbol) */}
      <ellipse cx="65" cy="62" rx="7" ry="9" fill="#FF6D00" opacity="0.9" />
      <circle cx="65" cy="62" r="4.5" fill="#E91E63" />
      <circle cx="65" cy="62" r="2.5" fill="#1A1A1A" />
      {/* Flame around third eye */}
      {[0,60,120,180,240,300].map(a => <ellipse key={a} cx={65} cy={62} rx="2" ry="5" fill="#FF6D00" opacity="0.4" transform={`rotate(${a} 65 62) translate(0,-9)`}/>)}

      {/* Head */}
      <ellipse cx="65" cy="78" rx="28" ry="28" fill={blue} />
      <ellipse cx="65" cy="70" rx="22" ry="16" fill={blueL} opacity="0.4" />

      {/* Eyes */}
      <ellipse cx="54" cy="76" rx="7" ry="6" fill="white" opacity="0.9" /><ellipse cx="76" cy="76" rx="7" ry="6" fill="white" opacity="0.9" />
      <circle cx="55" cy="76" r="4.5" fill="#1A1A1A" /><circle cx="77" cy="76" r="4.5" fill="#1A1A1A" />
      <circle cx="56.5" cy="74.5" r="1.8" fill="white" /><circle cx="78.5" cy="74.5" r="1.8" fill="white" />

      {/* Tripundra — 3 horizontal lines on forehead */}
      {[55,58,61].map((y,i) => <line key={i} x1={56} y1={y} x2={74} y2={y} stroke="white" strokeWidth={2-i*0.3} opacity={0.9-i*0.1}/>)}

      {/* Smile */}<path d="M 58 85 Q 65 90 72 85" stroke="white" strokeWidth="1.2" fill="none" opacity="0.7" />

      {/* Blue throat — Neelkanth */}
      <ellipse cx="65" cy="106" rx="16" ry="10" fill="#1565C0" opacity="0.65" />

      {/* Body */}
      <ellipse cx="65" cy="100" rx="26" ry="10" fill={blue} opacity="0.8" />
      <path d="M 40 98 C 38 115 37 135 39 152 L 52 152 C 50 135 51 115 53 100 Z" fill={blue} opacity="0.75" />
      <path d="M 90 98 C 92 115 93 135 91 152 L 78 152 C 80 135 79 115 77 100 Z" fill={blue} opacity="0.75" />
      {/* Tiger skin pattern at waist */}
      {[0,8,16,24,32].map(x => <path key={x} d={`M ${40+x} 100 L ${43+x} 110 L ${46+x} 100`} stroke="#FF8F00" strokeWidth="1" fill="none" opacity="0.5"/>)}

      {/* Snake around neck */}
      <path d="M 40 94 C 48 102 65 105 80 100 C 90 97 96 90 94 84"
        stroke="#4CAF50" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M 40 94 C 48 102 65 105 80 100 C 90 97 96 90 94 84"
        stroke="#81C784" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Snake head */}
      <ellipse cx="94" cy="82" rx="6" ry="5" fill="#4CAF50" transform="rotate(-35 94 82)" />
      <circle cx="93" cy="80" r="1.8" fill="#1A1A1A" />
      {/* Forked tongue */}
      <path d="M 98 80 L 103 77 M 98 80 L 103 83" stroke="#FF5252" strokeWidth="1.2" fill="none" />

      {/* TRISHUL (trident) — the most iconic Shiva symbol */}
      {/* Staff */}
      <path d="M 108 155 L 108 22" stroke={gold} strokeWidth="4" strokeLinecap="round" />
      <path d="M 108 155 L 108 22" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" />
      {/* Crossbar on staff */}
      <line x1="100" y1="60" x2="116" y2="60" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      {/* Three prongs */}
      <path d="M 108 30 L 97 18 C 97 18 99 25 102 28 Z" fill={gold} />
      <path d="M 108 30 L 108 16 L 108 30" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      <path d="M 108 30 L 119 18 C 119 18 117 25 114 28 Z" fill={gold} />
      {/* Inner prong tips glow */}
      <circle cx="97" cy="18" r="3" fill={gold} opacity="0.8" />
      <circle cx="108" cy="14" r="3.5" fill={gold} opacity="0.9" />
      <circle cx="119" cy="18" r="3" fill={gold} opacity="0.8" />

      {/* Damaru (small drum) held in other hand */}
      <g transform="translate(28,112)">
        <path d="M 0 -8 L 10 0 L 0 8 Z" fill="#4E342E" /><path d="M 16 -8 L 6 0 L 16 8 Z" fill="#4E342E" />
        <line x1="0" y1="0" x2="16" y2="0" stroke="#795548" strokeWidth="1.5" />
        <circle cx="0" cy="-8" r="7" fill="#6D4C41" /><circle cx="0" cy="8" r="7" fill="#6D4C41" />
        <circle cx="16" cy="-8" r="7" fill="#6D4C41" /><circle cx="16" cy="8" r="7" fill="#6D4C41" />
        {/* Drum heads detail */}
        <circle cx="0" cy="-8" r="5" fill="#795548" opacity="0.7" /><circle cx="16" cy="8" r="5" fill="#795548" opacity="0.7" />
        {/* Hanging bead strings */}
        <path d="M -3 -8 C 18 -3 22 5 18 8" stroke="#795548" strokeWidth="1.2" fill="none" />
        <circle cx="8" cy="-1" r="2" fill={gold} opacity="0.7" />
      </g>
    </svg>
  );
}

function LakshmiSVG({ gold }: { gold: string }) {
  // Goddess Lakshmi — lotus, gold coins, 4 arms, red sari
  const skin = "#FFCCBC", skinL = "#FFE0B2";
  return (
    <svg viewBox="0 0 130 160" width="130" height="160">
      {/* 16-petal lotus aureole */}
      <circle cx="65" cy="72" r="56" fill={gold} opacity="0.09" />
      {Array.from({length:16}).map((_,i) => {
        const a = i*22.5*Math.PI/180;
        return <ellipse key={i} cx={65} cy={72} rx="4" ry="14" fill={gold} opacity="0.2" transform={`rotate(${i*22.5} 65 72) translate(0,-44)`}/>;
      })}
      <circle cx="65" cy="72" r="48" fill="none" stroke={gold} strokeWidth="1.2" opacity="0.4" />

      {/* Crown / Mukut */}
      <path d="M 44 34 L 49 16 L 58 28 L 65 14 L 72 28 L 81 16 L 86 34 Z" fill={gold} />
      <line x1="44" y1="34" x2="86" y2="34" stroke={gold} strokeWidth="2.5" />
      <circle cx="49" cy="18" r="4" fill="#E53935" /><circle cx="65" cy="16" r="5" fill="#FF6D00" /><circle cx="81" cy="18" r="4" fill="#E53935" />
      {[50,58,65,72,80].map(x => <circle key={x} cx={x} cy="33" r="2.5" fill="white" opacity="0.75"/>)}
      {/* Ornament chains */}
      <path d="M 44 34 Q 65 44 86 34" stroke={gold} strokeWidth="1" fill="none" opacity="0.6" />

      {/* Head */}
      <ellipse cx="65" cy="55" rx="19" ry="22" fill={skin} />
      <ellipse cx="65" cy="48" rx="14" ry="12" fill={skinL} opacity="0.5" />
      {/* Bindi */}<circle cx="65" cy="40" r="3.5" fill="#E91E63" />
      {/* Eyes */}
      <ellipse cx="56" cy="53" rx="6.5" ry="6" fill="white" opacity="0.9" /><ellipse cx="74" cy="53" rx="6.5" ry="6" fill="white" opacity="0.9" />
      <circle cx="57" cy="53" r="4" fill="#1A1A1A" /><circle cx="75" cy="53" r="4" fill="#1A1A1A" />
      <circle cx="58.5" cy="51.5" r="1.6" fill="white" /><circle cx="76.5" cy="51.5" r="1.6" fill="white" />
      {/* Brow & lashes */}
      <path d="M 52 47 Q 57 44 61 47" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      <path d="M 69 47 Q 73 44 78 47" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      {/* Smile */}<path d="M 59 61 Q 65 66 71 61" stroke="#E57373" strokeWidth="1.5" fill="none" />
      {/* Nose ornament */}<circle cx="65" cy="58" r="2.5" fill={gold} opacity="0.8" />

      {/* Ornate necklace */}
      <path d="M 50 74 Q 65 88 80 74" stroke={gold} strokeWidth="2" fill="none" />
      {[54,62,65,68,76].map(x => <circle key={x} cx={x} cy={x===65?87:83} r="3.5" fill={gold} opacity="0.85"/>)}

      {/* Body — red sari with gold border */}
      <ellipse cx="65" cy="82" rx="20" ry="8" fill="#C62828" />
      <path d="M 46 79 C 44 98 43 122 45 150 L 56 150 C 54 122 55 98 57 80 Z" fill="#C62828" />
      <path d="M 84 79 C 86 98 87 122 85 150 L 74 150 C 76 122 75 98 73 80 Z" fill="#B71C1C" />
      {/* Gold sari border */}
      <path d="M 43 79 Q 65 92 87 79" stroke={gold} strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M 44 150 L 56 150" stroke={gold} strokeWidth="2" /><path d="M 74 150 L 86 150" stroke={gold} strokeWidth="2" />

      {/* 4 Arms */}
      {/* Lower left — pink lotus */}
      <path d="M 46 92 C 34 104 26 116 22 128" stroke={skin} strokeWidth="9" fill="none" strokeLinecap="round" />
      {[0,72,144,216,288].map(a => <ellipse key={a} cx={20} cy={130} rx="5" ry="12" fill="#F48FB1" opacity="0.8" transform={`rotate(${a} 20 130) translate(0,-13)`}/>)}
      <circle cx="20" cy="130" r="7" fill={gold} opacity="0.85" />

      {/* Lower right — raining gold coins (Varada mudra) */}
      <path d="M 84 92 C 96 104 104 116 108 128" stroke={skin} strokeWidth="9" fill="none" strokeLinecap="round" />
      {[108,114,120,126,132].map((y,i) => <ellipse key={i} cx={106+(i%2)*5} cy={y} rx="5" ry="4" fill={gold} opacity={0.95-i*0.12}/>)}
      {/* Coin shine */}
      {[108,120,132].map((y,i) => <ellipse key={i} cx={105} cy={y} rx="2" ry="1.5" fill="white" opacity="0.4"/>)}

      {/* Upper left — lotus */}
      <path d="M 46 82 C 32 70 24 58 20 46" stroke={skin} strokeWidth="8" fill="none" strokeLinecap="round" />
      {[0,90,180,270].map(a => <ellipse key={a} cx={18} cy={44} rx="4" ry="10" fill="#F48FB1" opacity="0.8" transform={`rotate(${a} 18 44) translate(0,-11)`}/>)}
      <circle cx="18" cy="44" r="5.5" fill={gold} opacity="0.8" />

      {/* Upper right — blessing (Abhaya mudra) */}
      <path d="M 84 82 C 98 70 106 58 110 46" stroke={skin} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Open palm */}
      <ellipse cx="112" cy="44" rx="8" ry="10" fill={skin} />
      {[0,1,2,3].map(i => <rect key={i} x={108+i*2} y={36} width="2" height="6" rx="1" fill={skinL}/>)}
      {/* Om symbol on palm */}
      <text x="112" y="48" textAnchor="middle" fontSize="8" fill={gold} opacity="0.8" fontFamily="serif">ॐ</text>

      {/* Large lotus at feet */}
      <g transform="translate(65,155)">
        {Array.from({length:12}).map((_,i) => <ellipse key={i} cx={0} cy={0} rx="6" ry="15" fill={i%2===0?"#F48FB1":"#F06292"} opacity={i%2===0?0.85:0.7} transform={`rotate(${i*30}) translate(0,-17)`}/>)}
        <circle r="11" fill={gold} opacity="0.85" />
        <circle r="6" fill="#FFF9C4" opacity="0.7" />
        <text x="0" y="4" textAnchor="middle" fontSize="8" fill={gold} opacity="0.8" fontFamily="serif">ॐ</text>
      </g>
    </svg>
  );
}

function CrownSVG({ color }: { color: string }) {
  return <svg viewBox="0 0 120 60" width="120" height="60"><polygon points="10,50 10,20 30,5 60,30 90,5 110,20 110,50" fill={color} opacity="0.9" /><circle cx="30" cy="8" r="6" fill="#E53935" /><circle cx="60" cy="28" r="7" fill="#E91E63" /><circle cx="90" cy="8" r="6" fill="#E53935" /><rect x="8" y="48" width="104" height="10" rx="3" fill={color} />{[25,40,55,70,85].map(x=><circle key={x} cx={x} cy="52" r="2" fill="white" opacity="0.7" />)}</svg>;
}
function RoyalCornerSVG({ color }: { color: string }) {
  // Ornate mandala/filigree corner — inspired by reference image 1
  // A rich, symmetric decorative corner extending ~140px along both edges
  return (
    <svg viewBox="0 0 140 140" width={140} height={140}>
      {/* Outer corner arcs (like a frame) */}
      <path d="M 5 70 Q 5 5 70 5" stroke={color} strokeWidth="2" fill="none" opacity="0.75" />
      <path d="M 5 55 Q 5 5 55 5" stroke={color} strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M 5 82 Q 5 5 82 5" stroke={color} strokeWidth="0.7" fill="none" opacity="0.3" />

      {/* Central lotus/mandala ornament at corner */}
      <g transform="translate(30,30)">
        {/* Outer circle */}
        <circle r="20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <circle r="14" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
        {/* 8 petals */}
        {[0,45,90,135,180,225,270,315].map((a,i) => (
          <ellipse key={a} rx={i%2===0?"3.5":"3"} ry={i%2===0?"10":"8"}
            fill={color} opacity={i%2===0?0.65:0.45}
            transform={`rotate(${a}) translate(0,${i%2===0?-10:-9})`} />
        ))}
        {/* Inner center */}
        <circle r="6" fill={color} opacity="0.7" />
        <circle r="3" fill="white" opacity="0.5" />
        {/* 4 outer diamond accents */}
        {[0,90,180,270].map(a => (
          <g key={a} transform={`rotate(${a}) translate(0,-22)`}>
            <polygon points="0,-3.5 3,0 0,3.5 -3,0" fill={color} opacity="0.7" />
          </g>
        ))}
      </g>

      {/* Horizontal extending ornament (along top edge) */}
      <path d="M 50 22 C 65 18 80 24 95 20 C 108 17 122 22 135 20"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.65" />
      <path d="M 50 28 C 65 26 80 30 95 28 C 108 26 120 29 130 28"
        stroke={color} strokeWidth="0.7" fill="none" opacity="0.4" />
      {/* Diamond markers along horizontal */}
      {[62, 86, 110].map(x => (
        <g key={x} transform={`translate(${x},21)`}>
          <polygon points="0,-4 3.5,0 0,4 -3.5,0" fill={color} opacity="0.7" />
        </g>
      ))}
      {/* Dot between diamonds */}
      {[74, 98].map(x => <circle key={x} cx={x} cy={21} r="1.8" fill={color} opacity="0.5" />)}

      {/* Vertical extending ornament (along left edge) */}
      <path d="M 22 50 C 18 65 24 80 20 95 C 17 108 22 122 20 135"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.65" />
      <path d="M 28 50 C 26 65 30 80 28 95 C 26 108 29 120 28 130"
        stroke={color} strokeWidth="0.7" fill="none" opacity="0.4" />
      {/* Diamond markers along vertical */}
      {[62, 86, 110].map(y => (
        <g key={y} transform={`translate(21,${y})`}>
          <polygon points="0,-4 3.5,0 0,4 -3.5,0" fill={color} opacity="0.7" />
        </g>
      ))}
      {[74, 98].map(y => <circle key={y} cx={21} cy={y} r="1.8" fill={color} opacity="0.5" />)}

      {/* Connecting scrollwork at the very corner */}
      <path d="M 5 38 C 14 28 28 14 38 5" stroke={color} strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M 5 22 C 10 14 14 10 22 5" stroke={color} strokeWidth="0.8" fill="none" opacity="0.35" />
      {/* Small scroll curls */}
      <path d="M 5 5 C 10 5 13 8 10 11 C 8 13 5 11 7 8" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="6" cy="6" r="2" fill={color} opacity="0.8" />
    </svg>
  );
}
function RoyalDividerSVG({ color }: { color: string }) {
  return <svg viewBox="0 0 400 20" width="100%" height="20"><line x1="0" y1="10" x2="160" y2="10" stroke={color} strokeWidth="1" opacity="0.6" /><g transform="translate(200,10)"><polygon points="0,-7 6,0 0,7 -6,0" fill={color} opacity="0.9" /><polygon points="0,-4 3.5,0 0,4 -3.5,0" fill="white" opacity="0.5" /><g transform="translate(-18,0)"><polygon points="0,-4 3,0 0,4 -3,0" fill={color} opacity="0.6" /></g><g transform="translate(18,0)"><polygon points="0,-4 3,0 0,4 -3,0" fill={color} opacity="0.6" /></g></g><line x1="240" y1="10" x2="400" y2="10" stroke={color} strokeWidth="1" opacity="0.6" /></svg>;
}
function RoyalPhotoFrame({ photoUrl, colors }: { photoUrl?: string; colors: BiodataTemplate["colors"] }) {
  return <div style={{ width: "160px", height: "190px", borderRadius: "50%/42%", border: `4px solid ${colors.secondary}`, overflow: "hidden", background: colors.lightBg, boxShadow: `0 0 0 6px white,0 0 0 9px ${colors.secondary}60,0 8px 24px ${colors.secondary}30`, margin: "0 auto" }}>{photoUrl?<img src={photoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:"60px",opacity:0.3}}>👤</div>}</div>;
}
function RoyalSectionHeader({ title, colors }: { title: string; colors: BiodataTemplate["colors"] }) {
  return <div style={{ borderBottom: `2px solid ${colors.secondary}`, paddingBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: colors.secondary }}>✦</span><span style={{ fontFamily: "'Cinzel',serif", fontSize: "12px", fontWeight: 700, color: colors.primary, letterSpacing: "2px", textTransform: "uppercase" }}>{title}</span><span style={{ color: colors.secondary }}>✦</span></div>;
}
function RoyalInfoRow({ label, value, colors }: { label: string; value: string; colors: BiodataTemplate["colors"] }) {
  return <div style={{ display: "flex", gap: "6px", padding: "2.5px 0", borderBottom: `1px solid ${colors.accent}30` }}><span style={{ fontSize: "10px", color: colors.secondary, fontWeight: 700, minWidth: "80px", textTransform: "uppercase" }}>{label}</span><span style={{ fontSize: "11px", color: colors.text }}>: {value}</span></div>;
}

// ─── ❸ TRADITIONAL BIODATA ───────────────────────────────────────────────────

function TraditionalBiodata({ template, data }: BP) {
  const { colors, fonts } = template;
  const name = data.personal?.fullName || "Your Name";
  const pRows = personalRows(data); const fRows = familyRows(data); const eRows = expectationRows(data);

  return (
    <div style={{ width: "794px", minHeight: "1123px", background: colors.background, fontFamily: "'Hind',sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: "10px", border: `2px solid ${colors.primary}40`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: "15px", border: `1px dashed ${colors.secondary}30`, pointerEvents: "none" }} />
      {/* Lotus mandala corners */}
      {[{ top: 0, left: 0 }, { top: 0, right: 0, transform: "scaleX(-1)" }, { bottom: 0, left: 0, transform: "scaleY(-1)" }, { bottom: 0, right: 0, transform: "scale(-1,-1)" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, pointerEvents: "none" }}><LotusCornerSVG color={colors.primary} secondary={colors.secondary} /></div>
      ))}

      <div style={{ background: `linear-gradient(135deg,${colors.primary} 0%,#BF360C 50%,${colors.primary} 100%)`, padding: "22px 80px 18px", textAlign: "center", position: "relative" }}>
        {/* Radha-Krishna image per template */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
          <DeityImage templateId={template.id} gold={colors.secondary} onDarkBg />
        </div>
        <div style={{ fontSize: "10px", color: colors.secondary, letterSpacing: "3px", opacity: 0.9, marginBottom: "4px" }}>✦ MARRIAGE BIODATA ✦</div>
        <div style={{ fontFamily: `'${fonts.heading}',serif`, fontSize: "46px", fontWeight: 700, color: colors.secondary, lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "8px" }}>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right,transparent,${colors.secondary}70)` }} />
          <span style={{ fontSize: "11px", color: colors.secondary, letterSpacing: "4px", fontWeight: 600 }}>MARRIAGE BIODATA</span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left,transparent,${colors.secondary}70)` }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "-1px 0 0" }}>
        <div style={{ background: colors.lightBg, borderRadius: "0 0 60px 60px", padding: "16px 24px 20px", border: `1px solid ${colors.primary}30`, borderTop: "none", display: "inline-block" }}>
          <div style={{ width: "130px", height: "130px", borderRadius: "50%", border: `3px solid ${colors.secondary}`, overflow: "hidden", background: colors.lightBg, boxShadow: `0 0 0 5px white,0 0 0 8px ${colors.primary}40`, margin: "0 auto" }}>
            {data.photoUrl ? <img src={data.photoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:"50px",opacity:0.3}}>👤</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 50px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", marginBottom: "14px" }}>
          {pRows.map(({ label, value }) => <TraditionalInfoRow key={label} label={label} value={value} colors={colors} />)}
        </div>
        <LotusLineSVG color={colors.primary} secondary={colors.secondary} />
        {data.aboutMe && <div style={{ margin: "12px 0", padding: "12px 16px", background: colors.lightBg, borderRadius: "8px", border: `1px solid ${colors.primary}20` }}><p style={{ fontSize: "12px", lineHeight: 1.7, color: "#444", textAlign: "center", fontStyle: "italic" }}>❝ {data.aboutMe} ❞</p></div>}
        <LotusLineSVG color={colors.primary} secondary={colors.secondary} />
        <div style={{ display: "flex", gap: "18px", marginTop: "14px" }}>
          {fRows.length > 0 && <div style={{ flex: 1 }}><TraditionalSectionTitle title="Family Details" colors={colors} />{fRows.map(({ label, value }) => <TraditionalInfoRow key={label} label={label} value={value} colors={colors} />)}</div>}
          <div style={{ flex: 1 }}>
            <TraditionalSectionTitle title="Education & Career" colors={colors} />
            {[row("Qualification",data.education?.highestQualification),row("Field",data.education?.fieldOfStudy),row("Employment",data.career?.employmentType),row("Designation",data.career?.currentDesignation),row("Company",data.career?.company),row("Income",data.career?.annualIncome)].filter(notNull).map(({ label, value }: { label: string; value: string }) => <TraditionalInfoRow key={label} label={label} value={value} colors={colors} />)}
          </div>
        </div>
        {eRows.length > 0 && <><LotusLineSVG color={colors.primary} secondary={colors.secondary} /><TraditionalSectionTitle title="Partner Expectations" colors={colors} /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", marginTop: "6px" }}>{eRows.map(({ label, value }) => <TraditionalInfoRow key={label} label={label} value={value} colors={colors} />)}</div></>}
        <LotusLineSVG color={colors.primary} secondary={colors.secondary} />
        <div style={{ background: `linear-gradient(135deg,${colors.primary}20,${colors.lightBg})`, borderRadius: "10px", padding: "14px", marginTop: "12px", textAlign: "center", border: `1px solid ${colors.primary}30` }}>
          <div style={{ marginBottom: "8px" }}><span style={{ fontSize: "10px", fontWeight: 700, color: colors.primary, letterSpacing: "4px" }}>✦ CONTACT ✦</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", fontSize: "12px", color: "#333" }}>
            {data.contact?.contactName && <span>👤 {data.contact.contactName}</span>}
            {data.contact?.phone && <span>📞 {data.contact.phone}</span>}
            {data.contact?.email && <span>✉ {data.contact.email}</span>}
            {data.contact?.city && <span>📍 {data.contact.city}, {data.contact.state}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
function LotusCornerSVG({ color, secondary }: { color: string; secondary: string }) {
  // Rich lotus-mandala corner inspired by reference image 1 (traditional Indian style)
  return (
    <svg viewBox="0 0 140 140" width={140} height={140}>
      {/* Arc frame lines */}
      <path d="M 5 72 Q 5 5 72 5" stroke={color} strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M 5 56 Q 5 5 56 5" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M 5 86 Q 5 5 86 5" stroke={color} strokeWidth="0.7" fill="none" opacity="0.25" />

      {/* Central lotus at corner */}
      <g transform="translate(32,32)">
        {/* Outer glow ring */}
        <circle r="22" fill={secondary} opacity="0.12" />
        <circle r="22" fill="none" stroke={secondary} strokeWidth="1.5" opacity="0.6" />
        <circle r="15" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
        {/* 8 lotus petals */}
        {[0,45,90,135,180,225,270,315].map((a,i) => (
          <ellipse key={a} rx="4" ry="11"
            fill={i%2===0?color:secondary} opacity={i%2===0?0.7:0.5}
            transform={`rotate(${a}) translate(0,-12)`} />
        ))}
        {/* 4 outer accent petals (smaller, between) */}
        {[22.5,112.5,202.5,292.5].map(a => (
          <ellipse key={a} rx="2.5" ry="7" fill={color} opacity="0.4"
            transform={`rotate(${a}) translate(0,-19)`} />
        ))}
        <circle r="7" fill={color} opacity="0.8" />
        <circle r="3.5" fill="white" opacity="0.5" />
        {/* 4 tip ornaments */}
        {[0,90,180,270].map(a => (
          <g key={a} transform={`rotate(${a}) translate(0,-25)`}>
            <polygon points="0,-3 2.5,0 0,3 -2.5,0" fill={secondary} opacity="0.8" />
          </g>
        ))}
      </g>

      {/* Horizontal ornamental band */}
      <path d="M 54 24 C 68 20 82 26 97 22 C 110 18 124 24 137 22"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 54 30 C 68 28 82 32 97 30 C 110 28 122 31 132 30"
        stroke={color} strokeWidth="0.6" fill="none" opacity="0.35" />
      {[66,88,112].map(x => <g key={x} transform={`translate(${x},23)`}>
        <polygon points="0,-4 3.5,0 0,4 -3.5,0" fill={color} opacity="0.7" />
      </g>)}
      {[77,100].map(x => <circle key={x} cx={x} cy={23} r="2" fill={secondary} opacity="0.6" />)}

      {/* Vertical ornamental band */}
      <path d="M 24 54 C 20 68 26 82 22 97 C 18 110 24 124 22 137"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 30 54 C 28 68 32 82 30 97 C 28 110 31 122 30 132"
        stroke={color} strokeWidth="0.6" fill="none" opacity="0.35" />
      {[66,88,112].map(y => <g key={y} transform={`translate(23,${y})`}>
        <polygon points="0,-4 3.5,0 0,4 -3.5,0" fill={color} opacity="0.7" />
      </g>)}
      {[77,100].map(y => <circle key={y} cx={23} cy={y} r="2" fill={secondary} opacity="0.6" />)}

      {/* Corner decorative scrolls */}
      <path d="M 5 5 C 11 5 14 9 11 12 C 9 14 5 12 7 9" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M 5 36 C 14 26 26 14 36 5" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
      <circle cx="6" cy="6" r="2.5" fill={secondary} opacity="0.8" />
    </svg>
  );
}
function LotusSmallSVG({ color }: { color: string }) {
  return <svg viewBox="0 0 40 40" width={40} height={40}><g transform="translate(20,20)">{[0,60,120,180,240,300].map(a=><ellipse key={a} rx="3.5" ry="10" fill={color} opacity="0.7" transform={`rotate(${a}) translate(0,-10)`}/>)}<circle r="6" fill={color}/><circle r="3" fill="white" opacity="0.4"/></g></svg>;
}
function LotusLineSVG({ color, secondary }: { color: string; secondary: string }) {
  return <svg viewBox="0 0 600 24" width="100%" height="24" style={{ margin: "8px 0" }}><line x1="0" y1="12" x2="230" y2="12" stroke={color} strokeWidth="0.8" opacity="0.4"/><g transform="translate(300,12)"><polygon points="0,-8 7,0 0,8 -7,0" fill={color} opacity="0.15"/><polygon points="0,-8 7,0 0,8 -7,0" fill="none" stroke={color} strokeWidth="1" opacity="0.7"/><polygon points="0,-4 4,0 0,4 -4,0" fill={color} opacity="0.5"/><circle cx="0" cy="-11" r="1.5" fill={color} opacity="0.5"/><circle cx="11" cy="0" r="1.5" fill={color} opacity="0.5"/><circle cx="0" cy="11" r="1.5" fill={color} opacity="0.5"/><circle cx="-11" cy="0" r="1.5" fill={color} opacity="0.5"/><polygon points="-22,-4 -19,0 -22,4 -25,0" fill={secondary} opacity="0.4"/><polygon points="22,-4 25,0 22,4 19,0" fill={secondary} opacity="0.4"/></g><line x1="370" y1="12" x2="600" y2="12" stroke={color} strokeWidth="0.8" opacity="0.4"/></svg>;
}
function TraditionalSectionTitle({ title, colors }: { title: string; colors: BiodataTemplate["colors"] }) {
  return <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ color: colors.secondary, fontSize: "14px" }}>🪷</span><span style={{ fontFamily: "'Yatra One',serif", fontSize: "14px", fontWeight: 700, color: colors.primary }}>{title}</span></div>;
}
function TraditionalInfoRow({ label, value, colors }: { label: string; value: string; colors: BiodataTemplate["colors"] }) {
  return <div style={{ display: "flex", gap: "6px", padding: "2px 0", borderBottom: `1px dotted ${colors.primary}20` }}><span style={{ fontSize: "10px", color: colors.secondary, fontWeight: 700, minWidth: "78px", textTransform: "uppercase" }}>{label}</span><span style={{ fontSize: "11px", color: "#333" }}>: {value}</span></div>;
}

// ─── ❹ MODERN BIODATA ────────────────────────────────────────────────────────

function ModernBiodata({ template, data }: BP) {
  const { colors, fonts } = template;
  const name = data.personal?.fullName || "Your Name";
  const pRows = personalRows(data); const fRows = familyRows(data); const eRows = expectationRows(data);

  return (
    <div style={{ width: "794px", minHeight: "1123px", background: "#FFFFFF", fontFamily: "'Inter','Segoe UI',sans-serif", position: "relative", display: "flex" }}>
      <div style={{ width: "8px", background: `linear-gradient(180deg,${colors.primary} 0%,${colors.secondary} 100%)`, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ background: `linear-gradient(135deg,${colors.primary} 0%,${colors.secondary} 100%)`, padding: "30px 50px 26px", display: "flex", alignItems: "center", gap: "28px" }}>
          <div style={{ width: "130px", height: "130px", borderRadius: "50%", border: "4px solid rgba(255,255,255,0.9)", overflow: "hidden", background: "rgba(255,255,255,0.15)", flexShrink: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            {data.photoUrl?<img src={data.photoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:"52px",opacity:0.4,color:"white"}}>👤</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: colors.accent, letterSpacing: "5px", textTransform: "uppercase", marginBottom: "6px", opacity: 0.9 }}>MARRIAGE BIODATA</div>
            <div style={{ fontFamily: `'${fonts.heading}',sans-serif`, fontSize: "44px", fontWeight: 800, color: "white", lineHeight: 1.05, letterSpacing: "-0.5px" }}>{name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "10px" }}>
              {[data.career?.currentDesignation,data.contact?.city&&data.contact?.state?`${data.contact.city}, ${data.contact.state}`:null,data.personal?.height].filter(notNull).map((v,i)=>(
                <span key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "4px", height: "4px", borderRadius: "50%", background: colors.accent, display: "inline-block" }}/>{v}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 50px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 28px" }}>
          <div>
            <ModernSection title="Personal Details" color={colors.primary}>
              {pRows.map(({ label, value }) => <ModernInfoRow key={label} label={label} value={value} />)}
            </ModernSection>
            {fRows.length > 0 && <ModernSection title="Family Details" color={colors.primary}>{fRows.map(({ label, value }) => <ModernInfoRow key={label} label={label} value={value} />)}</ModernSection>}
          </div>
          <div>
            <ModernSection title="Education & Career" color={colors.primary}>
              {[row("Qualification",data.education?.highestQualification),row("Field",data.education?.fieldOfStudy),row("College",data.education?.institution),row("Employment",data.career?.employmentType),row("Designation",data.career?.currentDesignation),row("Company",data.career?.company),row("Income",data.career?.annualIncome),row("Work City",data.career?.workLocation)].filter(notNull).map(({ label, value }: { label: string; value: string }) => <ModernInfoRow key={label} label={label} value={value} />)}
            </ModernSection>
            {data.aboutMe && <ModernSection title="About Me" color={colors.primary}><p style={{ fontSize: "11px", lineHeight: 1.7, color: "#444" }}>{data.aboutMe}</p>{data.hobbies && <p style={{ fontSize: "11px", color: colors.primary, marginTop: "6px" }}>🎯 {data.hobbies}</p>}</ModernSection>}
          </div>
          {eRows.length > 0 && <div style={{ gridColumn: "1/-1" }}><ModernSection title="Partner Expectations" color={colors.primary}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>{eRows.map(({ label, value }) => <ModernInfoRow key={label} label={label} value={value} />)}</div></ModernSection></div>}
          <div style={{ gridColumn: "1/-1", background: `linear-gradient(135deg,${colors.primary}10,${colors.secondary}08)`, borderRadius: "10px", padding: "14px 20px", border: `1px solid ${colors.primary}20` }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: colors.primary, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>Contact</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {[{icon:"👤",val:data.contact?.contactName},{icon:"📞",val:data.contact?.phone},{icon:"✉",val:data.contact?.email},{icon:"📍",val:data.contact?.city?`${data.contact.city}, ${data.contact.state}`:null}].filter(x=>x.val).map(({icon,val})=>(
                <span key={val} style={{ fontSize: "12px", color: "#333", display: "flex", gap: "4px" }}>{icon} {val}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ModernSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: "18px" }}><div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}><div style={{ width: "4px", height: "16px", background: color, borderRadius: "2px" }}/><span style={{ fontSize: "11px", fontWeight: 800, color, letterSpacing: "2px", textTransform: "uppercase" }}>{title}</span></div><div style={{ paddingLeft: "12px" }}>{children}</div></div>;
}
function ModernInfoRow({ label, value }: { label: string; value: string }) {
  return <div style={{ display: "flex", gap: "6px", padding: "3px 0", borderBottom: "1px solid #F0F0F0" }}><span style={{ fontSize: "10px", color: "#999", minWidth: "80px", textTransform: "uppercase" }}>{label}</span><span style={{ fontSize: "11px", color: "#222", fontWeight: 500 }}>{value}</span></div>;
}

// ─── ❺ LUXURY BIODATA ────────────────────────────────────────────────────────

function LuxuryBiodata({ template, data }: BP) {
  const { colors, fonts } = template;
  const name = data.personal?.fullName || "Your Name";
  const pRows = personalRows(data); const fRows = familyRows(data); const eRows = expectationRows(data);

  return (
    <div style={{ width: "794px", minHeight: "1123px", background: "#0D0D0D", fontFamily: "'Raleway',sans-serif", position: "relative", color: "#E8D5A3" }}>
      <div style={{ position: "absolute", inset: "10px", border: `1.5px solid ${colors.secondary}`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: "16px", border: `0.5px solid ${colors.secondary}40`, pointerEvents: "none" }} />
      {[{ top: 0, left: 0 }, { top: 0, right: 0, transform: "scaleX(-1)" }, { bottom: 0, left: 0, transform: "scaleY(-1)" }, { bottom: 0, right: 0, transform: "scale(-1,-1)" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, pointerEvents: "none" }}><ArtDecoCornerSVG color={colors.secondary} /></div>
      ))}

      <div style={{ textAlign: "center", padding: "52px 80px 28px" }}>
        <ArtDecoHeaderSVG color={colors.secondary} />
        <div style={{ display: "flex", justifyContent: "center", margin: "18px 0 14px" }}>
          <div style={{
            width: "150px", height: "150px",
            borderRadius: "50%", overflow: "hidden",
            border: `3px solid ${colors.secondary}`,
            boxShadow: `0 0 0 5px #111, 0 0 0 8px ${colors.secondary}`,
            background: "#1a1a1a",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {data.photoUrl
              ? <img src={data.photoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:"56px",opacity:0.2,color:colors.secondary}}>👤</div>
            }
          </div>
        </div>
        <div style={{ fontFamily: `'${fonts.heading}',serif`, fontSize: "48px", fontWeight: 400, color: colors.secondary, lineHeight: 1.1, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "8px" }}>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right,transparent,${colors.secondary}80)` }} />
          <span style={{ fontSize: "9px", letterSpacing: "7px", color: colors.accent, textTransform: "uppercase" }}>Marriage Biodata</span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left,transparent,${colors.secondary}80)` }} />
        </div>
        <ArtDecoHeaderSVG color={colors.secondary} flip />
      </div>

      <div style={{ padding: "8px 60px 40px" }}>
        <LuxurySection title="Personal Details" color={colors.secondary}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 28px" }}>
            {pRows.map(({ label, value }) => <LuxuryInfoRow key={label} label={label} value={value} colors={colors} />)}
          </div>
        </LuxurySection>
        {data.aboutMe && <LuxurySection title="About Me" color={colors.secondary}><p style={{ fontSize: "12px", lineHeight: 1.8, color: "#C0A878", textAlign: "center", fontStyle: "italic" }}>❝ {data.aboutMe} ❞</p></LuxurySection>}
        <div style={{ display: "flex", gap: "24px" }}>
          {fRows.length > 0 && <div style={{ flex: 1 }}><LuxurySection title="Family" color={colors.secondary} compact>{fRows.map(({ label, value }) => <LuxuryInfoRow key={label} label={label} value={value} colors={colors} />)}</LuxurySection></div>}
          <div style={{ flex: 1 }}>
            <LuxurySection title="Education & Career" color={colors.secondary} compact>
              {[row("Qualification",data.education?.highestQualification),row("Field",data.education?.fieldOfStudy),row("Designation",data.career?.currentDesignation),row("Company",data.career?.company),row("Income",data.career?.annualIncome)].filter(notNull).map(({ label, value }: { label: string; value: string }) => <LuxuryInfoRow key={label} label={label} value={value} colors={colors} />)}
            </LuxurySection>
          </div>
        </div>
        {eRows.length > 0 && <LuxurySection title="Partner Expectations" color={colors.secondary} compact><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>{eRows.map(({ label, value }) => <LuxuryInfoRow key={label} label={label} value={value} colors={colors} />)}</div></LuxurySection>}
        <div style={{ marginTop: "20px", border: `1px solid ${colors.secondary}50`, borderRadius: "8px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "9px", letterSpacing: "6px", color: colors.secondary, textTransform: "uppercase", marginBottom: "10px" }}>✦ Contact ✦</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", fontSize: "12px", color: colors.accent }}>
            {data.contact?.contactName && <span>👤 {data.contact.contactName}</span>}
            {data.contact?.phone && <span>📞 {data.contact.phone}</span>}
            {data.contact?.email && <span>✉ {data.contact.email}</span>}
            {data.contact?.city && <span>📍 {data.contact.city}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
function ArtDecoCornerSVG({ color }: { color: string }) {
  // Art Deco luxury corner — strong geometric, extends along edges
  return (
    <svg viewBox="0 0 120 120" width={120} height={120}>
      {/* Outer L-frame lines */}
      <line x1="5" y1="5" x2="100" y2="5" stroke={color} strokeWidth="2" opacity="0.8" />
      <line x1="5" y1="5" x2="5" y2="100" stroke={color} strokeWidth="2" opacity="0.8" />
      <line x1="12" y1="12" x2="80" y2="12" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="12" y1="12" x2="12" y2="80" stroke={color} strokeWidth="0.8" opacity="0.5" />

      {/* Art deco quarter-fan arcs */}
      <path d="M 5 45 Q 5 5 45 5" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M 5 60 Q 5 5 60 5" stroke={color} strokeWidth="0.7" fill="none" opacity="0.3" />

      {/* Central geometric diamond star */}
      <g transform="translate(28,28)">
        {/* Outer square rotated */}
        <rect x="-14" y="-14" width="28" height="28" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" transform="rotate(45)" />
        <rect x="-10" y="-10" width="20" height="20" fill="none" stroke={color} strokeWidth="0.7" opacity="0.4" transform="rotate(45)" />
        {/* Center filled diamond */}
        <polygon points="0,-9 9,0 0,9 -9,0" fill={color} opacity="0.25" />
        <polygon points="0,-9 9,0 0,9 -9,0" fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
        <polygon points="0,-5 5,0 0,5 -5,0" fill={color} opacity="0.7" />
        {/* Tick marks on diamond points */}
        {[0,90,180,270].map(a => (
          <g key={a} transform={`rotate(${a}) translate(0,-12)`}>
            <line x1="0" y1="0" x2="0" y2="-4" stroke={color} strokeWidth="1.5" opacity="0.7" />
          </g>
        ))}
      </g>

      {/* Stepped tier blocks along horizontal edge */}
      {[[44,5,8,7],[55,5,6,6],[66,5,4,5],[78,5,3,4]].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={color} opacity={0.5-i*0.07} />
      ))}
      {/* Stepped tier blocks along vertical edge */}
      {[[5,44,7,8],[5,55,6,6],[5,66,5,4],[5,78,4,3]].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={color} opacity={0.5-i*0.07} />
      ))}

      {/* Diamond accents along horizontal */}
      {[50,68,86].map(x => <g key={x} transform={`translate(${x},5)`}>
        <polygon points="0,-3 2.5,0 0,3 -2.5,0" fill={color} opacity="0.6" />
      </g>)}
      {/* Diamond accents along vertical */}
      {[50,68,86].map(y => <g key={y} transform={`translate(5,${y})`}>
        <polygon points="0,-3 2.5,0 0,3 -2.5,0" fill={color} opacity="0.6" />
      </g>)}

      {/* Precise corner star */}
      <polygon points="5,2 6.5,5 5,8 3.5,5" fill={color} opacity="0.9" />
    </svg>
  );
}
function ArtDecoHeaderSVG({ color, flip }: { color: string; flip?: boolean }) {
  return <svg viewBox="0 0 400 24" width="380" height="24" style={{ display: "block", margin: "0 auto", transform: flip?"scaleY(-1)":undefined }}><line x1="0" y1="12" x2="140" y2="12" stroke={color} strokeWidth="1" opacity="0.6"/><line x1="0" y1="8" x2="100" y2="8" stroke={color} strokeWidth="0.5" opacity="0.35"/><line x1="0" y1="16" x2="100" y2="16" stroke={color} strokeWidth="0.5" opacity="0.35"/>{[140,155,168].map((x,i)=><rect key={x} x={x} y={12-(3-i)*2} width={10} height={(3-i)*4||4} fill={color} opacity={0.3+i*0.15}/>)}<g transform="translate(200,12)"><polygon points="0,-9 8,0 0,9 -8,0" fill="none" stroke={color} strokeWidth="1.2" opacity="0.8"/><polygon points="0,-5 5,0 0,5 -5,0" fill={color} opacity="0.5"/></g>{[232,245,260].map((x,i)=><rect key={x} x={x} y={12-(i)*2} width={10} height={i*4||4} fill={color} opacity={0.6-i*0.15}/>)}<line x1="260" y1="12" x2="400" y2="12" stroke={color} strokeWidth="1" opacity="0.6"/><line x1="300" y1="8" x2="400" y2="8" stroke={color} strokeWidth="0.5" opacity="0.35"/><line x1="300" y1="16" x2="400" y2="16" stroke={color} strokeWidth="0.5" opacity="0.35"/></svg>;
}
function LuxurySection({ title, color, children, compact }: { title: string; color: string; children: React.ReactNode; compact?: boolean }) {
  return <div style={{ marginBottom: compact?"12px":"18px" }}><div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}><div style={{ flex: 1, height: "1px", background: `linear-gradient(to right,transparent,${color}50)` }}/><span style={{ fontSize: "9px", fontWeight: 700, color, letterSpacing: "5px", textTransform: "uppercase" }}>{title}</span><div style={{ flex: 1, height: "1px", background: `linear-gradient(to left,transparent,${color}50)` }}/></div>{children}</div>;
}
function LuxuryInfoRow({ label, value, colors }: { label: string; value: string; colors: BiodataTemplate["colors"] }) {
  return <div style={{ display: "flex", gap: "8px", padding: "3px 0", borderBottom: `1px solid ${colors.secondary}15` }}><span style={{ fontSize: "9px", color: colors.secondary, fontWeight: 600, minWidth: "80px", textTransform: "uppercase", opacity: 0.8 }}>{label}</span><span style={{ fontSize: "11px", color: "#D4C4A0" }}>: {value}</span></div>;
}

// ─── ❻ HERITAGE BIODATA ──────────────────────────────────────────────────────

function HeritageBiodata({ template, data }: BP) {
  const { colors, fonts } = template;
  const name = data.personal?.fullName || "Your Name";
  const pRows = personalRows(data); const fRows = familyRows(data); const eRows = expectationRows(data);

  return (
    <div style={{ width: "794px", minHeight: "1123px", background: "#FDF6EE", fontFamily: `'${fonts.body}','Georgia',serif`, position: "relative" }}>
      <div style={{ position: "absolute", inset: "10px", border: `2px solid ${colors.secondary}60`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: "15px", border: `1px solid ${colors.accent}`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: "20px", border: `0.5px solid ${colors.secondary}30`, pointerEvents: "none" }} />
      {[{ top: 0, left: 0 }, { top: 0, right: 0, transform: "scaleX(-1)" }, { bottom: 0, left: 0, transform: "scaleY(-1)" }, { bottom: 0, right: 0, transform: "scale(-1,-1)" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, pointerEvents: "none" }}><VictorianCornerSVG color={colors.secondary} /></div>
      ))}

      <div style={{ textAlign: "center", padding: "44px 90px 24px" }}>
        {/* Radha-Krishna image for Heritage templates */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <DeityImage templateId={template.id} gold={colors.secondary} onDarkBg={false} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <div style={{ width: "130px", height: "150px", borderRadius: "50%/44%", border: `3px solid ${colors.secondary}`, overflow: "hidden", background: colors.lightBg, boxShadow: `3px 3px 0 ${colors.secondary}40,0 0 0 6px white,0 0 0 8px ${colors.secondary}30` }}>
            {data.photoUrl?<img src={data.photoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"sepia(20%)"}}/>:<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:"50px",opacity:0.25}}>👤</div>}
          </div>
        </div>
        <div style={{ fontSize: "11px", color: colors.secondary, letterSpacing: "3px", marginBottom: "8px", opacity: 0.8 }}>— AUSPICIOUS MARRIAGE BIODATA —</div>
        <div style={{ fontFamily: `'${fonts.heading}',serif`, fontSize: "46px", fontWeight: 400, color: colors.primary, lineHeight: 1.1, letterSpacing: "1px", fontStyle: "italic" }}>{name}</div>
        <VintageRuleSVG color={colors.secondary} />
      </div>

      <div style={{ padding: "12px 60px 40px" }}>
        <HeritageSection title="Personal Details" colors={colors}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 24px" }}>
            {pRows.map(({ label, value }) => <HeritageInfoRow key={label} label={label} value={value} colors={colors} />)}
          </div>
        </HeritageSection>
        {data.aboutMe && <HeritageSection title="About Me" colors={colors}><p style={{ fontSize: "12px", lineHeight: 1.8, color: "#5D4037", textAlign: "center", fontStyle: "italic" }}>❝ {data.aboutMe} ❞</p></HeritageSection>}
        <div style={{ display: "flex", gap: "20px" }}>
          {fRows.length > 0 && <div style={{ flex: 1 }}><HeritageSection title="Family Details" colors={colors} compact>{fRows.map(({ label, value }) => <HeritageInfoRow key={label} label={label} value={value} colors={colors} />)}</HeritageSection></div>}
          <div style={{ flex: 1 }}>
            <HeritageSection title="Education & Career" colors={colors} compact>
              {[row("Qualification",data.education?.highestQualification),row("Field",data.education?.fieldOfStudy),row("Designation",data.career?.currentDesignation),row("Company",data.career?.company),row("Income",data.career?.annualIncome)].filter(notNull).map(({ label, value }: { label: string; value: string }) => <HeritageInfoRow key={label} label={label} value={value} colors={colors} />)}
            </HeritageSection>
          </div>
        </div>
        {eRows.length > 0 && <HeritageSection title="Partner Expectations" colors={colors} compact><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 24px" }}>{eRows.map(({ label, value }) => <HeritageInfoRow key={label} label={label} value={value} colors={colors} />)}</div></HeritageSection>}
        <VintageRuleSVG color={colors.secondary} />
        <div style={{ textAlign: "center", marginTop: "14px", padding: "14px", background: `${colors.lightBg}80`, border: `1px solid ${colors.secondary}40`, borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: colors.secondary, letterSpacing: "4px", marginBottom: "8px" }}>✦ CONTACT ✦</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px", fontSize: "12px", color: "#5D4037" }}>
            {data.contact?.contactName && <span>👤 {data.contact.contactName}</span>}
            {data.contact?.phone && <span>📞 {data.contact.phone}</span>}
            {data.contact?.email && <span>✉ {data.contact.email}</span>}
            {data.contact?.city && <span>📍 {data.contact.city}, {data.contact.state}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
function VictorianCornerSVG({ color }: { color: string }) {
  // Ornate filigree corner for Heritage — similar to image 1 gold carved style
  return (
    <svg viewBox="0 0 130 130" width={130} height={130}>
      {/* Multi-arc frame */}
      <path d="M 5 66 Q 5 5 66 5" stroke={color} strokeWidth="2" fill="none" opacity="0.65" />
      <path d="M 5 50 Q 5 5 50 5" stroke={color} strokeWidth="1.2" fill="none" opacity="0.45" />
      <path d="M 5 80 Q 5 5 80 5" stroke={color} strokeWidth="0.6" fill="none" opacity="0.25" />

      {/* Central floral motif */}
      <g transform="translate(28,28)">
        <circle r="19" fill="none" stroke={color} strokeWidth="1.5" opacity="0.65" />
        <circle r="13" fill="none" stroke={color} strokeWidth="0.8" opacity="0.45" />
        {/* 6 petals */}
        {[0,60,120,180,240,300].map(a => (
          <ellipse key={a} rx="3.5" ry="9" fill={color} opacity="0.55"
            transform={`rotate(${a}) translate(0,-9)`} />
        ))}
        <circle r="6" fill={color} opacity="0.7" />
        <circle r="3" fill="white" opacity="0.4" />
        {[0,90,180,270].map(a => (
          <g key={a} transform={`rotate(${a}) translate(0,-21.5)`}>
            <polygon points="0,-3 2.5,0 0,3 -2.5,0" fill={color} opacity="0.65" />
          </g>
        ))}
      </g>

      {/* Horizontal band */}
      <path d="M 47 21 C 62 17 76 23 90 19 C 103 15 117 21 128 19"
        stroke={color} strokeWidth="1.4" fill="none" opacity="0.6" />
      <path d="M 47 27 C 62 25 76 29 90 27 C 103 25 115 28 126 27"
        stroke={color} strokeWidth="0.6" fill="none" opacity="0.35" />
      {[62,82,104].map(x => <g key={x} transform={`translate(${x},20)`}>
        <polygon points="0,-3.5 3,0 0,3.5 -3,0" fill={color} opacity="0.65" />
      </g>)}

      {/* Vertical band */}
      <path d="M 21 47 C 17 62 23 76 19 90 C 15 103 21 117 19 128"
        stroke={color} strokeWidth="1.4" fill="none" opacity="0.6" />
      <path d="M 27 47 C 25 62 29 76 27 90 C 25 103 28 115 27 126"
        stroke={color} strokeWidth="0.6" fill="none" opacity="0.35" />
      {[62,82,104].map(y => <g key={y} transform={`translate(20,${y})`}>
        <polygon points="0,-3.5 3,0 0,3.5 -3,0" fill={color} opacity="0.65" />
      </g>)}

      {/* Corner scroll */}
      <path d="M 5 5 C 12 5 15 9 12 13 C 10 15 6 13 8 9" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M 5 32 C 14 22 22 14 32 5" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
      <circle cx="5.5" cy="5.5" r="2.5" fill={color} opacity="0.75" />
    </svg>
  );
}
function VintageRuleSVG({ color }: { color: string }) {
  return <svg viewBox="0 0 500 18" width="100%" height="18" style={{ margin: "8px 0" }}><line x1="0" y1="7" x2="500" y2="7" stroke={color} strokeWidth="0.8" opacity="0.5"/><line x1="0" y1="11" x2="500" y2="11" stroke={color} strokeWidth="0.3" opacity="0.3"/><g transform="translate(250,9)"><polygon points="0,-5 4,0 0,5 -4,0" fill={color} opacity="0.6"/><line x1="-20" y1="0" x2="-8" y2="0" stroke={color} strokeWidth="1.2" opacity="0.5"/><line x1="8" y1="0" x2="20" y2="0" stroke={color} strokeWidth="1.2" opacity="0.5"/><circle cx="-28" cy="0" r="1.5" fill={color} opacity="0.4"/><circle cx="28" cy="0" r="1.5" fill={color} opacity="0.4"/></g></svg>;
}
function HeritageSection({ title, colors, children, compact }: { title: string; colors: BiodataTemplate["colors"]; children: React.ReactNode; compact?: boolean }) {
  return <div style={{ marginBottom: compact?"12px":"16px" }}><div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}><div style={{ flex: 1, height: "1px", background: `linear-gradient(to right,transparent,${colors.secondary}60)` }}/><span style={{ fontFamily: "'IM Fell English',serif", fontSize: "14px", fontWeight: 700, color: colors.primary, letterSpacing: "1px", fontStyle: "italic" }}>— {title} —</span><div style={{ flex: 1, height: "1px", background: `linear-gradient(to left,transparent,${colors.secondary}60)` }}/></div><div style={{ background: "rgba(255,255,255,0.5)", borderRadius: "6px", padding: "8px 12px", border: `1px solid ${colors.secondary}20` }}>{children}</div></div>;
}
function HeritageInfoRow({ label, value, colors }: { label: string; value: string; colors: BiodataTemplate["colors"] }) {
  return <div style={{ display: "flex", gap: "6px", padding: "2.5px 0", borderBottom: `1px solid ${colors.secondary}20` }}><span style={{ fontSize: "10px", color: colors.secondary, fontWeight: 700, minWidth: "78px", textTransform: "uppercase" }}>{label}</span><span style={{ fontSize: "11px", color: "#5D4037" }}>: {value}</span></div>;
}

