/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Aviation Palette
        "sky-900": "#051B35",
        "sky-800": "#0D2A47",
        "sky-700": "#164863",
        "sky-600": "#2E5090",
        "sky-500": "#1D3A70",
        "sky-400": "#4A90E2",
        "sky-300": "#7DB4E8",
        "sky-200": "#B8D7F5",
        "sky-100": "#E8F1F9",
        "sky-50": "#F5F8FC",
        
        // Accent Colors
        "accent-teal": "#0BA98F",
        "accent-gold": "#D4AF37",
        "accent-silver": "#E8E8E8",
        
        // Status Colors (Refined)
        "status-success": "#059669",
        "status-success-light": "#D1FAE5",
        "status-warning": "#D97706",
        "status-warning-light": "#FEF3C7",
        "status-error": "#DC2626",
        "status-error-light": "#FEE2E2",
        "status-info": "#2563EB",
        "status-info-light": "#DBEAFE",
        
        // Neutral Palette
        "neutral-950": "#0F172A",
        "neutral-900": "#111827",
        "neutral-800": "#1F2937",
        "neutral-700": "#374151",
        "neutral-600": "#4B5563",
        "neutral-500": "#6B7280",
        "neutral-400": "#9CA3AF",
        "neutral-300": "#D1D5DB",
        "neutral-200": "#E5E7EB",
        "neutral-100": "#F3F4F6",
        "neutral-50": "#F9FAFB",
      },
      borderRadius: {
        "xs": "4px",
        "sm": "6px",
        "md": "8px",
        "lg": "12px",
        "xl": "16px",
        "2xl": "20px",
      },
      boxShadow: {
        "xs": "0 1px 2px 0 rgba(15, 23, 42, 0.03)",
        "sm": "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        "md": "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        "lg": "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)",
        "xl": "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
        "elevation": "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
      },
      fontSize: {
        "xs": ["12px", { lineHeight: "16px", letterSpacing: "0.3px" }],
        "sm": ["14px", { lineHeight: "20px", letterSpacing: "0.25px" }],
        "base": ["16px", { lineHeight: "24px", letterSpacing: "0px" }],
        "lg": ["18px", { lineHeight: "28px", letterSpacing: "0px" }],
        "xl": ["20px", { lineHeight: "28px", letterSpacing: "-0.5px" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.5px" }],
        "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-1px" }],
      },
      fontWeight: {
        "thin": "100",
        "extralight": "200",
        "light": "300",
        "normal": "400",
        "medium": "500",
        "semibold": "600",
        "bold": "700",
        "extrabold": "800",
      },
    },
  },
  plugins: [],
};
