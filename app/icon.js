import { ImageResponse } from 'next/og';

// Image metadata settings
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            // This JSX mimics your Tailwind design:
            // bg-gradient-to-br from-orange-500 to-red-600 rounded-lg
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #f97316, #dc2626)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px', // Approx rounded-lg
                }}
            >
                {/* We use a simple white SVG cross to represent the "life reach church logo"
                   since the favicon is too small to render complex external images perfectly */}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2v20M5 9h14" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}