import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content";

// Image metadata — Next wires these into <head> automatically. This single
// file supplies both og:image and twitter:image (summary_large_image).
export const alt = "vour.dev — Full-Stack Developer portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const profile = await getProfile();
  const { name, title, headline, domain, available, availabilityText } = profile;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          color: "#fafafa",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Brand glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 78% 12%, rgba(59,130,246,0.28), transparent 55%)",
          }}
        />

        {/* Top row: brand mark + availability */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 88,
                height: 88,
                borderRadius: 22,
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                fontSize: 48,
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              V
            </div>
            <div
              style={{ display: "flex", marginLeft: 26, fontSize: 32, color: "#a1a1aa" }}
            >
              {domain}
            </div>
          </div>

          {available ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 999,
                border: "1px solid rgba(16,185,129,0.35)",
                background: "rgba(16,185,129,0.12)",
                padding: "12px 24px",
                fontSize: 24,
                color: "#34d399",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#10b981",
                  marginRight: 12,
                }}
              />
              {availabilityText || "Available for work"}
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}
        </div>

        {/* Center: name + role + headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 46,
              fontWeight: 600,
              color: "#60a5fa",
            }}
          >
            {title}
          </div>
          {headline ? (
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 30,
                color: "#a1a1aa",
                maxWidth: 920,
                lineHeight: 1.4,
              }}
            >
              {headline}
            </div>
          ) : null}
        </div>

        {/* Bottom accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            color: "#71717a",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 44,
              height: 4,
              borderRadius: 2,
              background: "#3b82f6",
              marginRight: 20,
            }}
          />
          Portfolio · {domain}
        </div>
      </div>
    ),
    { ...size },
  );
}
