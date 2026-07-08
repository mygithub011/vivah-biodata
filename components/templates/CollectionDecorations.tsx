import React from "react";
import { TemplateColors } from "@/types";

interface DecorProps {
  colors: TemplateColors;
}

// ─── Floral: Rose flower corners + vine borders ───────────────────────────────

function FloralRoseCorner({ color, leafColor, size = 90 }: { color: string; leafColor: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} overflow="visible">
      {/* Main flower at corner */}
      <g transform="translate(22,22)">
        <ellipse rx="5.5" ry="13" fill={color} opacity="0.75" transform="rotate(0) translate(0,-14)" />
        <ellipse rx="5.5" ry="13" fill={color} opacity="0.65" transform="rotate(72) translate(0,-14)" />
        <ellipse rx="5.5" ry="13" fill={color} opacity="0.75" transform="rotate(144) translate(0,-14)" />
        <ellipse rx="5.5" ry="13" fill={color} opacity="0.65" transform="rotate(216) translate(0,-14)" />
        <ellipse rx="5.5" ry="13" fill={color} opacity="0.75" transform="rotate(288) translate(0,-14)" />
        <circle r="8" fill={color} />
        <circle r="5" fill="white" opacity="0.5" />
        <circle r="2.5" fill={color} opacity="0.8" />
      </g>
      {/* Vine right */}
      <path d="M 32 24 Q 55 18 80 22" stroke={leafColor} strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* Vine down */}
      <path d="M 24 32 Q 18 55 22 80" stroke={leafColor} strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* Leaves on horizontal vine */}
      <ellipse cx="50" cy="19" rx="6" ry="3.5" fill={leafColor} opacity="0.6" transform="rotate(-10 50 19)" />
      <ellipse cx="68" cy="21" rx="5" ry="3" fill={leafColor} opacity="0.5" transform="rotate(-5 68 21)" />
      {/* Leaves on vertical vine */}
      <ellipse cx="19" cy="50" rx="3.5" ry="6" fill={leafColor} opacity="0.6" transform="rotate(-80 19 50)" />
      <ellipse cx="21" cy="68" rx="3" ry="5" fill={leafColor} opacity="0.5" transform="rotate(-80 21 68)" />
      {/* Small bud blooms at vine ends */}
      <g transform="translate(80,22)">
        <ellipse rx="3" ry="6" fill={color} opacity="0.6" transform="rotate(0) translate(0,-5)" />
        <ellipse rx="3" ry="6" fill={color} opacity="0.6" transform="rotate(120) translate(0,-5)" />
        <ellipse rx="3" ry="6" fill={color} opacity="0.6" transform="rotate(240) translate(0,-5)" />
        <circle r="3.5" fill={color} opacity="0.8" />
      </g>
      <g transform="translate(22,80)">
        <ellipse rx="3" ry="6" fill={color} opacity="0.6" transform="rotate(0) translate(0,-5)" />
        <ellipse rx="3" ry="6" fill={color} opacity="0.6" transform="rotate(120) translate(0,-5)" />
        <ellipse rx="3" ry="6" fill={color} opacity="0.6" transform="rotate(240) translate(0,-5)" />
        <circle r="3.5" fill={color} opacity="0.8" />
      </g>
      {/* Mid-vine small buds */}
      <circle cx="50" cy="21" r="0" />
      <g transform="translate(50,21)">
        <circle r="2.5" fill={color} opacity="0.5" />
      </g>
      <g transform="translate(22,50)">
        <circle r="2.5" fill={color} opacity="0.5" />
      </g>
    </svg>
  );
}

export function FloralDecorations({ colors }: DecorProps) {
  const flower = colors.primary;
  const leaf = "#4CAF50";
  const s = 90;
  return (
    <>
      {/* Top-left */}
      <div style={{ position: "absolute", top: 6, left: 6, pointerEvents: "none" }}>
        <FloralRoseCorner color={flower} leafColor={leaf} size={s} />
      </div>
      {/* Top-right (flipped horizontal) */}
      <div style={{ position: "absolute", top: 6, right: 6, pointerEvents: "none", transform: "scaleX(-1)" }}>
        <FloralRoseCorner color={flower} leafColor={leaf} size={s} />
      </div>
      {/* Bottom-left (flipped vertical) */}
      <div style={{ position: "absolute", bottom: 6, left: 6, pointerEvents: "none", transform: "scaleY(-1)" }}>
        <FloralRoseCorner color={flower} leafColor={leaf} size={s} />
      </div>
      {/* Bottom-right (flipped both) */}
      <div style={{ position: "absolute", bottom: 6, right: 6, pointerEvents: "none", transform: "scale(-1,-1)" }}>
        <FloralRoseCorner color={flower} leafColor={leaf} size={s} />
      </div>
    </>
  );
}

export function FloralHeaderOrnament({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 40" width="400" height="40" style={{ display: "block", margin: "0 auto" }}>
      {/* Central large flower */}
      <g transform="translate(200,20)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} rx="4" ry="9" fill={color} opacity="0.7"
            transform={`rotate(${angle}) translate(0,-10)`} />
        ))}
        <circle r="6" fill={color} />
        <circle r="3" fill="white" opacity="0.5" />
      </g>
      {/* Left garland */}
      <path d="M 195 20 Q 175 12 155 18 Q 135 12 115 18 Q 95 12 75 18 Q 55 12 35 20" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
      {/* Right garland */}
      <path d="M 205 20 Q 225 12 245 18 Q 265 12 285 18 Q 305 12 325 18 Q 345 12 365 20" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
      {/* Small flowers along garland L */}
      {[75, 115, 155].map((x) => (
        <g key={x} transform={`translate(${x},18)`}>
          {[0, 90, 180, 270].map((a) => (
            <ellipse key={a} rx="2.5" ry="5" fill={color} opacity="0.6"
              transform={`rotate(${a}) translate(0,-6)`} />
          ))}
          <circle r="3" fill={color} opacity="0.8" />
        </g>
      ))}
      {/* Small flowers along garland R */}
      {[245, 285, 325].map((x) => (
        <g key={x} transform={`translate(${x},18)`}>
          {[0, 90, 180, 270].map((a) => (
            <ellipse key={a} rx="2.5" ry="5" fill={color} opacity="0.6"
              transform={`rotate(${a}) translate(0,-6)`} />
          ))}
          <circle r="3" fill={color} opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

export function FloralSectionDivider({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 20" width="100%" height="20" style={{ display: "block" }}>
      <line x1="0" y1="10" x2="130" y2="10" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <g transform="translate(150,10)">
        {[0, 90, 180, 270].map((a) => (
          <ellipse key={a} rx="2.5" ry="5.5" fill={color} opacity="0.6"
            transform={`rotate(${a}) translate(0,-6)`} />
        ))}
        <circle r="3.5" fill={color} opacity="0.8" />
      </g>
      <line x1="170" y1="10" x2="300" y2="10" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// ─── Royal: Crown + filigree scroll corners ───────────────────────────────────

function RoyalScrollCorner({ color, size = 90 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Outer arc */}
      <path d="M 5 45 Q 5 5 45 5" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Inner arc */}
      <path d="M 5 30 Q 5 5 30 5" stroke={color} strokeWidth="2" fill="none" opacity="0.7" />
      {/* Corner scroll */}
      <path d="M 5 5 C 20 5 25 20 18 25 C 11 30 5 25 8 18" stroke={color} strokeWidth="1.8" fill="none" />
      {/* Diagonal flourish line */}
      <path d="M 5 5 L 50 50" stroke={color} strokeWidth="0.6" opacity="0.3" strokeDasharray="2,3" />
      {/* Diamond accents on diagonal */}
      <g transform="translate(18,18)">
        <polygon points="0,-4 3,0 0,4 -3,0" fill={color} opacity="0.8" />
      </g>
      <g transform="translate(32,32)">
        <polygon points="0,-3 2.5,0 0,3 -2.5,0" fill={color} opacity="0.6" />
      </g>
      <g transform="translate(46,46)">
        <polygon points="0,-2.5 2,0 0,2.5 -2,0" fill={color} opacity="0.5" />
      </g>
      {/* Scroll curl at the corner tip */}
      <path d="M 5 18 C 12 14 16 20 12 24" stroke={color} strokeWidth="1.2" fill="none" />
      <path d="M 18 5 C 14 12 20 16 24 12" stroke={color} strokeWidth="1.2" fill="none" />
      {/* Small leaf ornaments */}
      <path d="M 5 38 Q 18 28 28 5" stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="16" cy="21" r="2" fill={color} opacity="0.6" />
      <circle cx="21" cy="16" r="2" fill={color} opacity="0.6" />
    </svg>
  );
}

export function RoyalDecorations({ colors }: DecorProps) {
  const gold = colors.secondary;
  const s = 88;
  return (
    <>
      <div style={{ position: "absolute", top: 6, left: 6, pointerEvents: "none" }}>
        <RoyalScrollCorner color={gold} size={s} />
      </div>
      <div style={{ position: "absolute", top: 6, right: 6, pointerEvents: "none", transform: "scaleX(-1)" }}>
        <RoyalScrollCorner color={gold} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 6, left: 6, pointerEvents: "none", transform: "scaleY(-1)" }}>
        <RoyalScrollCorner color={gold} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 6, right: 6, pointerEvents: "none", transform: "scale(-1,-1)" }}>
        <RoyalScrollCorner color={gold} size={s} />
      </div>
    </>
  );
}

export function RoyalHeaderOrnament({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 50" width="300" height="50" style={{ display: "block", margin: "0 auto" }}>
      {/* Crown */}
      <g transform="translate(150,35)">
        {/* Crown base */}
        <rect x="-28" y="-10" width="56" height="10" fill={color} opacity="0.8" rx="2" />
        {/* Crown points */}
        <polygon points="-24,-10 -20,-30 -16,-10" fill={color} opacity="0.9" />
        <polygon points="-6,-10 0,-38 6,-10" fill={color} opacity="1" />
        <polygon points="16,-10 20,-30 24,-10" fill={color} opacity="0.9" />
        {/* Crown jewels */}
        <circle cx="-20" cy="-24" r="3.5" fill="#E53935" />
        <circle cx="0" cy="-32" r="4.5" fill="#E91E63" />
        <circle cx="20" cy="-24" r="3.5" fill="#E53935" />
        <circle cx="-10" cy="-5" r="2.5" fill="white" opacity="0.7" />
        <circle cx="0" cy="-5" r="2.5" fill="white" opacity="0.7" />
        <circle cx="10" cy="-5" r="2.5" fill="white" opacity="0.7" />
      </g>
      {/* Flanking flourish lines */}
      <path d="M 10 42 Q 60 30 115 38" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 290 42 Q 240 30 185 38" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Diamond accents */}
      <g transform="translate(60,35)"><polygon points="0,-5 4,0 0,5 -4,0" fill={color} opacity="0.7" /></g>
      <g transform="translate(90,33)"><polygon points="0,-3 2.5,0 0,3 -2.5,0" fill={color} opacity="0.5" /></g>
      <g transform="translate(240,35)"><polygon points="0,-5 4,0 0,5 -4,0" fill={color} opacity="0.7" /></g>
      <g transform="translate(210,33)"><polygon points="0,-3 2.5,0 0,3 -2.5,0" fill={color} opacity="0.5" /></g>
    </svg>
  );
}

export function RoyalSectionDivider({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 16" width="100%" height="16" style={{ display: "block" }}>
      <line x1="0" y1="8" x2="120" y2="8" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <g transform="translate(150,8)">
        <polygon points="0,-6 5,0 0,6 -5,0" fill={color} opacity="0.8" />
        <polygon points="0,-3.5 3,0 0,3.5 -3,0" fill="white" opacity="0.7" />
        <line x1="-14" y1="0" x2="-7" y2="0" stroke={color} strokeWidth="1" opacity="0.6" />
        <line x1="7" y1="0" x2="14" y2="0" stroke={color} strokeWidth="1" opacity="0.6" />
      </g>
      <line x1="180" y1="8" x2="300" y2="8" stroke={color} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

// ─── Traditional Hindu: Lotus corners + Om header ─────────────────────────────

function LotusCorner({ color, size = 90 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* 8-petal lotus at corner */}
      <g transform="translate(24,24)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse key={angle} rx="4.5" ry="13"
            fill={i % 2 === 0 ? color : color}
            opacity={i % 2 === 0 ? 0.75 : 0.5}
            transform={`rotate(${angle}) translate(0,-12)`} />
        ))}
        <circle r="7" fill={color} />
        <circle r="4" fill="white" opacity="0.6" />
        <circle r="2" fill={color} />
      </g>
      {/* Stem right */}
      <path d="M 33 26 L 80 26" stroke={color} strokeWidth="1" opacity="0.35" strokeDasharray="3,2" />
      {/* Stem down */}
      <path d="M 26 33 L 26 80" stroke={color} strokeWidth="1" opacity="0.35" strokeDasharray="3,2" />
      {/* Small lotus buds on stems */}
      <g transform="translate(55,26)">
        <ellipse rx="3" ry="7" fill={color} opacity="0.5" transform="rotate(0) translate(0,-7)" />
        <ellipse rx="3" ry="7" fill={color} opacity="0.4" transform="rotate(90) translate(0,-7)" />
        <ellipse rx="3" ry="7" fill={color} opacity="0.5" transform="rotate(180) translate(0,-7)" />
        <ellipse rx="3" ry="7" fill={color} opacity="0.4" transform="rotate(270) translate(0,-7)" />
        <circle r="4" fill={color} opacity="0.6" />
      </g>
      <g transform="translate(26,55)">
        <ellipse rx="3" ry="7" fill={color} opacity="0.5" transform="rotate(0) translate(0,-7)" />
        <ellipse rx="3" ry="7" fill={color} opacity="0.4" transform="rotate(90) translate(0,-7)" />
        <ellipse rx="3" ry="7" fill={color} opacity="0.5" transform="rotate(180) translate(0,-7)" />
        <ellipse rx="3" ry="7" fill={color} opacity="0.4" transform="rotate(270) translate(0,-7)" />
        <circle r="4" fill={color} opacity="0.6" />
      </g>
      {/* Dots pattern */}
      {[40, 50, 60, 70, 80].map((v) => (
        <circle key={`h${v}`} cx={v} cy="26" r="1" fill={color} opacity="0.3" />
      ))}
      {[40, 50, 60, 70, 80].map((v) => (
        <circle key={`v${v}`} cx="26" cy={v} r="1" fill={color} opacity="0.3" />
      ))}
    </svg>
  );
}

export function TraditionalDecorations({ colors }: DecorProps) {
  const c = colors.primary;
  const s = 90;
  return (
    <>
      <div style={{ position: "absolute", top: 6, left: 6, pointerEvents: "none" }}>
        <LotusCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", top: 6, right: 6, pointerEvents: "none", transform: "scaleX(-1)" }}>
        <LotusCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 6, left: 6, pointerEvents: "none", transform: "scaleY(-1)" }}>
        <LotusCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 6, right: 6, pointerEvents: "none", transform: "scale(-1,-1)" }}>
        <LotusCorner color={c} size={s} />
      </div>
    </>
  );
}

export function TraditionalHeaderOrnament({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div style={{ textAlign: "center", margin: "4px 0" }}>
      {/* Om symbol in circle */}
      <svg viewBox="0 0 280 56" width="280" height="56" style={{ display: "block", margin: "0 auto" }}>
        {/* Left lotus buds */}
        <g transform="translate(30,28)">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} rx="3" ry="8" fill={primary} opacity="0.5"
              transform={`rotate(${a}) translate(0,-9)`} />
          ))}
          <circle r="5" fill={primary} opacity="0.7" />
        </g>
        <path d="M 40 28 L 100 28" stroke={secondary} strokeWidth="1" opacity="0.5" />
        {/* Central Om circle */}
        <g transform="translate(140,28)">
          <circle r="22" fill="none" stroke={secondary} strokeWidth="1.5" opacity="0.6" />
          <circle r="19" fill="none" stroke={primary} strokeWidth="0.8" opacity="0.4" />
          <text x="0" y="9" textAnchor="middle" fontSize="26" fill={primary}
            fontFamily="serif" fontWeight="bold" opacity="0.9">ॐ</text>
        </g>
        <path d="M 180 28 L 240 28" stroke={secondary} strokeWidth="1" opacity="0.5" />
        {/* Right lotus buds */}
        <g transform="translate(250,28)">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} rx="3" ry="8" fill={primary} opacity="0.5"
              transform={`rotate(${a}) translate(0,-9)`} />
          ))}
          <circle r="5" fill={primary} opacity="0.7" />
        </g>
        {/* Swastika marks on sides */}
        <text x="72" y="32" textAnchor="middle" fontSize="10" fill={secondary} opacity="0.5">卐</text>
        <text x="208" y="32" textAnchor="middle" fontSize="10" fill={secondary} opacity="0.5">卐</text>
      </svg>
    </div>
  );
}

export function TraditionalSectionDivider({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 18" width="100%" height="18" style={{ display: "block" }}>
      {/* Rangoli diamond pattern */}
      <line x1="0" y1="9" x2="115" y2="9" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <g transform="translate(150,9)">
        {/* Central diamond */}
        <polygon points="0,-7 7,0 0,7 -7,0" fill={color} opacity="0.15" />
        <polygon points="0,-7 7,0 0,7 -7,0" fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
        {/* Inner diamond */}
        <polygon points="0,-4 4,0 0,4 -4,0" fill={color} opacity="0.5" />
        {/* Dots at points */}
        <circle cx="0" cy="-9" r="1.5" fill={color} opacity="0.6" />
        <circle cx="9" cy="0" r="1.5" fill={color} opacity="0.6" />
        <circle cx="0" cy="9" r="1.5" fill={color} opacity="0.6" />
        <circle cx="-9" cy="0" r="1.5" fill={color} opacity="0.6" />
        {/* Small flanking diamonds */}
        <polygon points="-18,-3 -15,0 -18,3 -21,0" fill={color} opacity="0.4" />
        <polygon points="18,-3 21,0 18,3 15,0" fill={color} opacity="0.4" />
      </g>
      <line x1="185" y1="9" x2="300" y2="9" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// ─── Modern Minimal: Clean geometric brackets ─────────────────────────────────

function ModernBracketCorner({ color, size = 50 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 50 50" width={size} height={size}>
      {/* L-shaped bracket */}
      <path d="M 5 25 L 5 5 L 25 5" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="square" />
      {/* Small accent dot */}
      <circle cx="5" cy="5" r="2.5" fill={color} />
    </svg>
  );
}

export function ModernDecorations({ colors }: DecorProps) {
  const c = colors.primary;
  const s = 48;
  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, pointerEvents: "none" }}>
        <ModernBracketCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, pointerEvents: "none", transform: "scaleX(-1)" }}>
        <ModernBracketCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 10, pointerEvents: "none", transform: "scaleY(-1)" }}>
        <ModernBracketCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 10, right: 10, pointerEvents: "none", transform: "scale(-1,-1)" }}>
        <ModernBracketCorner color={c} size={s} />
      </div>
    </>
  );
}

export function ModernHeaderOrnament({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 12" width="300" height="12" style={{ display: "block", margin: "0 auto" }}>
      <line x1="0" y1="6" x2="120" y2="6" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <rect x="130" y="3" width="40" height="6" fill={color} opacity="0.6" rx="3" />
      <line x1="180" y1="6" x2="300" y2="6" stroke={color} strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

export function ModernSectionDivider({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 10" width="100%" height="10" style={{ display: "block" }}>
      <line x1="0" y1="5" x2="300" y2="5" stroke={color} strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

// ─── Luxury: Art Deco geometric corners ──────────────────────────────────────

function LuxuryArtDecoCorner({ color, size = 85 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Outer frame lines */}
      <line x1="5" y1="5" x2="55" y2="5" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="5" y1="5" x2="5" y2="55" stroke={color} strokeWidth="1.5" opacity="0.7" />
      {/* Inner frame */}
      <line x1="10" y1="10" x2="45" y2="10" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="10" y1="10" x2="10" y2="45" stroke={color} strokeWidth="0.8" opacity="0.5" />
      {/* Art Deco fan shape at corner */}
      <path d="M 5 5 Q 35 5 5 35" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M 5 5 Q 50 5 5 50" stroke={color} strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* Geometric diamonds */}
      <g transform="translate(5,5)">
        <polygon points="0,0 10,0 10,10 0,10" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
        <polygon points="5,1 9,5 5,9 1,5" fill={color} opacity="0.4" />
      </g>
      {/* Decorative lines radiating */}
      <line x1="20" y1="5" x2="20" y2="14" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="35" y1="5" x2="35" y2="11" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="5" y1="20" x2="14" y2="20" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="5" y1="35" x2="11" y2="35" stroke={color} strokeWidth="1" opacity="0.3" />
      {/* Small star at corner */}
      <polygon points="5,2 6,5 9,5 7,7 8,10 5,8 2,10 3,7 1,5 4,5"
        fill={color} opacity="0.8" transform="translate(0,0) scale(0.9)" />
    </svg>
  );
}

export function LuxuryDecorations({ colors }: DecorProps) {
  const gold = colors.secondary;
  const s = 84;
  return (
    <>
      <div style={{ position: "absolute", top: 6, left: 6, pointerEvents: "none" }}>
        <LuxuryArtDecoCorner color={gold} size={s} />
      </div>
      <div style={{ position: "absolute", top: 6, right: 6, pointerEvents: "none", transform: "scaleX(-1)" }}>
        <LuxuryArtDecoCorner color={gold} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 6, left: 6, pointerEvents: "none", transform: "scaleY(-1)" }}>
        <LuxuryArtDecoCorner color={gold} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 6, right: 6, pointerEvents: "none", transform: "scale(-1,-1)" }}>
        <LuxuryArtDecoCorner color={gold} size={s} />
      </div>
    </>
  );
}

export function LuxuryHeaderOrnament({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 36" width="320" height="36" style={{ display: "block", margin: "0 auto" }}>
      {/* Art deco symmetric design */}
      {/* Left arm */}
      <line x1="5" y1="18" x2="100" y2="18" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <line x1="5" y1="14" x2="80" y2="14" stroke={color} strokeWidth="0.8" opacity="0.35" />
      <line x1="5" y1="22" x2="80" y2="22" stroke={color} strokeWidth="0.8" opacity="0.35" />
      {/* Left stepped shapes */}
      {[100, 112, 122].map((x, i) => (
        <rect key={x} x={x} y={18 - (3 - i) * 2} width="8" height={(3 - i) * 4} fill={color} opacity={0.3 + i * 0.15} />
      ))}
      {/* Right arm */}
      <line x1="315" y1="18" x2="220" y2="18" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <line x1="315" y1="14" x2="240" y2="14" stroke={color} strokeWidth="0.8" opacity="0.35" />
      <line x1="315" y1="22" x2="240" y2="22" stroke={color} strokeWidth="0.8" opacity="0.35" />
      {/* Right stepped shapes */}
      {[220, 198, 188].map((x, i) => (
        <rect key={x} x={x} y={18 - (i) * 2} width="8" height={i * 4 || 4} fill={color} opacity={0.6 - i * 0.15} />
      ))}
      {/* Central diamond monogram */}
      <g transform="translate(160,18)">
        <polygon points="0,-15 15,0 0,15 -15,0" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />
        <polygon points="0,-10 10,0 0,10 -10,0" fill={color} opacity="0.12" />
        <polygon points="0,-10 10,0 0,10 -10,0" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <polygon points="0,-5 5,0 0,5 -5,0" fill={color} opacity="0.6" />
      </g>
    </svg>
  );
}

export function LuxurySectionDivider({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 14" width="100%" height="14" style={{ display: "block" }}>
      <line x1="0" y1="7" x2="110" y2="7" stroke={color} strokeWidth="1" opacity="0.5" />
      <g transform="translate(150,7)">
        <polygon points="0,-5 4,0 0,5 -4,0" fill={color} opacity="0.7" />
        <line x1="-20" y1="0" x2="-8" y2="0" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="8" y1="0" x2="20" y2="0" stroke={color} strokeWidth="1" opacity="0.5" />
      </g>
      <line x1="190" y1="7" x2="300" y2="7" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// ─── Heritage: Victorian scroll corners ──────────────────────────────────────

function HeritageScrollCorner({ color, size = 90 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Main Victorian scroll */}
      <path d="M 5 5 C 5 30 30 5 30 5 C 30 5 55 5 55 25 C 55 45 35 55 35 55 C 35 55 5 55 5 55 L 5 5"
        stroke={color} strokeWidth="1.2" fill="none" opacity="0.4" />
      {/* Corner curl */}
      <path d="M 5 5 C 18 5 22 18 14 22 C 8 26 5 22 8 16 C 10 12 14 12 16 16"
        stroke={color} strokeWidth="1.8" fill="none" />
      {/* Acanthus leaf scrolls */}
      <path d="M 5 5 C 28 8 32 28 28 32 C 24 36 12 30 12 22 C 12 14 20 12 24 16"
        stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M 5 5 L 30 30" stroke={color} strokeWidth="0.5" opacity="0.2" />
      {/* Decorative dots */}
      <circle cx="8" cy="8" r="2" fill={color} opacity="0.7" />
      <circle cx="18" cy="10" r="1.5" fill={color} opacity="0.5" />
      <circle cx="10" cy="18" r="1.5" fill={color} opacity="0.5" />
      <circle cx="25" cy="15" r="1.2" fill={color} opacity="0.4" />
      <circle cx="15" cy="25" r="1.2" fill={color} opacity="0.4" />
      {/* Straight border lines */}
      <line x1="5" y1="5" x2="55" y2="5" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="5" y1="5" x2="5" y2="55" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Dash inner line */}
      <line x1="12" y1="12" x2="45" y2="12" stroke={color} strokeWidth="0.6" opacity="0.3" strokeDasharray="3,2" />
      <line x1="12" y1="12" x2="12" y2="45" stroke={color} strokeWidth="0.6" opacity="0.3" strokeDasharray="3,2" />
    </svg>
  );
}

export function HeritageDecorations({ colors }: DecorProps) {
  const c = colors.secondary;
  const s = 88;
  return (
    <>
      <div style={{ position: "absolute", top: 6, left: 6, pointerEvents: "none" }}>
        <HeritageScrollCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", top: 6, right: 6, pointerEvents: "none", transform: "scaleX(-1)" }}>
        <HeritageScrollCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 6, left: 6, pointerEvents: "none", transform: "scaleY(-1)" }}>
        <HeritageScrollCorner color={c} size={s} />
      </div>
      <div style={{ position: "absolute", bottom: 6, right: 6, pointerEvents: "none", transform: "scale(-1,-1)" }}>
        <HeritageScrollCorner color={c} size={s} />
      </div>
    </>
  );
}

export function HeritageHeaderOrnament({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 44" width="320" height="44" style={{ display: "block", margin: "0 auto" }}>
      {/* Left flourish */}
      <path d="M 10 22 C 30 10 50 30 70 20 C 90 10 100 25 115 22"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Right flourish */}
      <path d="M 310 22 C 290 10 270 30 250 20 C 230 10 220 25 205 22"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Central wax seal circle */}
      <g transform="translate(160,22)">
        <circle r="19" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <circle r="15" fill="none" stroke={color} strokeWidth="0.8" opacity="0.45" strokeDasharray="2,2" />
        {/* 8-pointed star inside */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1="0" y1="-5" x2="0" y2="-13"
            stroke={color} strokeWidth="1" opacity="0.6"
            transform={`rotate(${a})`} />
        ))}
        <circle r="5" fill={color} opacity="0.5" />
        <text x="0" y="4" textAnchor="middle" fontSize="8" fill="white" opacity="0.8"
          fontFamily="serif">✦</text>
      </g>
      {/* Dots along flourishes */}
      {[40, 70, 100].map((x) => <circle key={x} cx={x} cy={22} r="1.5" fill={color} opacity="0.4" />)}
      {[280, 250, 220].map((x) => <circle key={x} cx={x} cy={22} r="1.5" fill={color} opacity="0.4" />)}
    </svg>
  );
}

export function HeritageSectionDivider({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 14" width="100%" height="14" style={{ display: "block" }}>
      {/* Double rule */}
      <line x1="0" y1="5" x2="300" y2="5" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="9" x2="300" y2="9" stroke={color} strokeWidth="0.4" opacity="0.25" />
      {/* Center ornament */}
      <g transform="translate(150,7)">
        <polygon points="0,-4 3.5,0 0,4 -3.5,0" fill={color} opacity="0.6" />
        <line x1="-20" y1="0" x2="-7" y2="0" stroke={color} strokeWidth="1" opacity="0.4" />
        <line x1="7" y1="0" x2="20" y2="0" stroke={color} strokeWidth="1" opacity="0.4" />
      </g>
    </svg>
  );
}

// ─── Master picker ────────────────────────────────────────────────────────────

export function CollectionCornerDecorations({ collectionId, colors }: { collectionId: string; colors: TemplateColors }) {
  switch (collectionId) {
    case "floral":      return <FloralDecorations colors={colors} />;
    case "royal":       return <RoyalDecorations colors={colors} />;
    case "traditional": return <TraditionalDecorations colors={colors} />;
    case "modern":      return <ModernDecorations colors={colors} />;
    case "luxury":      return <LuxuryDecorations colors={colors} />;
    case "heritage":    return <HeritageDecorations colors={colors} />;
    default:            return null;
  }
}

export function CollectionHeaderOrnament({ collectionId, colors }: { collectionId: string; colors: TemplateColors }) {
  switch (collectionId) {
    case "floral":      return <FloralHeaderOrnament color={colors.primary} />;
    case "royal":       return <RoyalHeaderOrnament color={colors.secondary} />;
    case "traditional": return <TraditionalHeaderOrnament primary={colors.primary} secondary={colors.secondary} />;
    case "modern":      return <ModernHeaderOrnament color={colors.primary} />;
    case "luxury":      return <LuxuryHeaderOrnament color={colors.secondary} />;
    case "heritage":    return <HeritageHeaderOrnament color={colors.secondary} />;
    default:            return null;
  }
}

export function CollectionSectionDivider({ collectionId, color }: { collectionId: string; color: string }) {
  switch (collectionId) {
    case "floral":      return <FloralSectionDivider color={color} />;
    case "royal":       return <RoyalSectionDivider color={color} />;
    case "traditional": return <TraditionalSectionDivider color={color} />;
    case "modern":      return <ModernSectionDivider color={color} />;
    case "luxury":      return <LuxurySectionDivider color={color} />;
    case "heritage":    return <HeritageSectionDivider color={color} />;
    default:            return null;
  }
}
