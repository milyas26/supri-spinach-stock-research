import { ImageResponse } from 'next/og';
import { siteDescription, siteName, siteUrl } from '@/lib/site';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? siteName;
  const description = searchParams.get('desc') ?? siteDescription;
  const type = searchParams.get('type') ?? '';

  // Load JetBrains Mono from Google Fonts
  const [fontRegular, fontBold] = await Promise.all([
    fetch('https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjOg.woff').then(
      (r) => r.arrayBuffer(),
    ),
    fetch('https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbX2o-flEEny0FZhsfKu5WU4xD-IQ-PuZJJXxfpAO-Lf1I.woff').then(
      (r) => r.arrayBuffer(),
    ),
  ]);

  const isLong = title.length > 55;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#F5F2EB',
          fontFamily: '"JetBrains Mono"',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Noise texture overlay via repeating dots */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, #2D2A2610 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.5,
          }}
        />

        {/* Left accent stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 8,
            background: '#C11F2A',
          }}
        />

        {/* Top-right decorative grid lines */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            right: 48,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            opacity: 0.18,
          }}
        >
          {[120, 80, 48, 28].map((w, i) => (
            <div
              key={i}
              style={{
                width: w,
                height: 2,
                background: '#2D2A26',
                marginLeft: 'auto',
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '52px 64px 44px 72px',
          }}
        >
          {/* Type badge */}
          {type ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#C11F2A',
                }}
              />
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#C11F2A',
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                {type}
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 28 }} />
          )}

          {/* Title */}
          <div
            style={{
              fontSize: isLong ? 32 : 42,
              fontWeight: 700,
              color: '#1E1C19',
              lineHeight: 1.25,
              marginBottom: 20,
              maxWidth: 860,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 17,
              fontWeight: 400,
              color: '#5C5650',
              lineHeight: 1.6,
              maxWidth: 780,
              flex: 1,
            }}
          >
            {description.slice(0, 130)}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #D1CCC0',
              paddingTop: 20,
              marginTop: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Logo mark */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: '#0D6B4E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    background: '#F5F2EB',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#1E1C19',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                {siteName}
              </div>
            </div>
            <div
              style={{
                fontSize: 13,
                color: '#8C857A',
                letterSpacing: 0.5,
              }}
            >
              supri-spinach.vercel.app
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 8,
            right: 0,
            height: 4,
            background: '#EDE9E0',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: fontBold, weight: 700, style: 'normal' },
      ],
    },
  );
}
