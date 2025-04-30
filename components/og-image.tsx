import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rami Cheikh Rouhou - Frontend Developer";
export const contentType = "image/png";

export default async function OgImage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          padding: "40px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "60px",
              fontWeight: "bold",
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: "20px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "30px",
              color: "#9ca3af",
              lineHeight: 1.4,
              marginTop: 0,
            }}
          >
            {description}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
