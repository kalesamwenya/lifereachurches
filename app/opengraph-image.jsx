import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.1) 0%, transparent 70%)',
          }}
        />
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: '96px',
              fontWeight: 900,
              color: 'white',
              margin: 0,
              letterSpacing: '-0.05em',
              textAlign: 'center',
            }}
          >
            Lifereach Church
          </h1>
          
          <div
            style={{
              width: '200px',
              height: '6px',
              background: '#ea580c',
              marginTop: '40px',
              marginBottom: '40px',
              borderRadius: '3px',
            }}
          />
          
          <p
            style={{
              fontSize: '36px',
              color: '#d1d5db',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Reaching Every Soul
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
