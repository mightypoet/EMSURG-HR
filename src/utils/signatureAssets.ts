/**
 * Default authentic digital signature for Swarnali Dey (General Manager Admin & HR)
 * Rendered as an SVG data URL with transparent background and rich pen ink strokes.
 */
export const defaultSwarnaliDeySignature = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 90" width="280" height="90">
  <g fill="none" stroke="#172554" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.92">
    <!-- Capital 'S' flourished -->
    <path d="M 28,48 C 22,34 32,20 46,20 C 58,20 62,30 52,42 C 40,56 34,68 56,70 C 72,72 82,58 84,46" />
    <!-- 'w-a-r' script loop -->
    <path d="M 84,48 C 88,42 94,38 98,46 C 102,52 108,38 114,46 C 118,50 122,40 128,44 C 132,48 136,44 140,42" />
    <!-- 'n-a-l-i' with high loop -->
    <path d="M 140,42 C 144,48 148,42 152,46 C 156,50 160,32 162,18 C 162,14 158,22 160,50 C 162,54 168,44 172,46" />
    <circle cx="173" cy="36" r="1.5" fill="#172554" />
    <!-- 'Dey' sweeping capital D and flourish -->
    <path d="M 188,26 L 192,68 C 192,68 184,32 208,24 C 226,18 238,32 226,50 C 216,64 198,66 186,64" stroke-width="2.8" />
    <path d="M 226,44 C 232,40 238,44 236,50 C 234,54 228,52 232,46" />
    <path d="M 238,44 C 242,48 246,52 248,58 C 252,70 236,78 220,76" />
    <!-- Underline flourish with pressure variance -->
    <path d="M 38,76 C 88,72 160,74 246,62 C 262,59 270,54 256,58 C 218,68 126,80 54,82" stroke-width="1.8" />
  </g>
</svg>
`)}`;

/**
 * Default official company seal stamp for Emsurg Healthcare India Pvt. Ltd.
 */
export const defaultEmsurgStamp = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <g fill="none" stroke="#0284c7" stroke-width="2.5" opacity="0.82">
    <!-- Double circle seal border -->
    <circle cx="80" cy="80" r="74" stroke-dasharray="4 2" stroke-width="2" />
    <circle cx="80" cy="80" r="68" stroke-width="2.5" />
    <circle cx="80" cy="80" r="46" stroke-width="1.5" />
    
    <!-- Central text -->
    <text x="80" y="74" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0284c7" letter-spacing="1">
      ADMIN &amp; HR
    </text>
    <text x="80" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#0284c7" letter-spacing="0.5">
      AUTHORIZED
    </text>
    <text x="80" y="99" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" fill="#0284c7">
      SIGNATORY
    </text>

    <!-- Circular paths for text -->
    <path id="circlePathTop" d="M 22,80 A 58,58 0 1,1 138,80" />
    <path id="circlePathBottom" d="M 138,80 A 58,58 0 0,1 22,80" />
  </g>
  <text font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#0284c7" letter-spacing="1.2">
    <textPath href="#circlePathTop" startOffset="50%" text-anchor="middle">
      EMSURG HEALTHCARE INDIA
    </textPath>
  </text>
  <text font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#0284c7" letter-spacing="1.2">
    <textPath href="#circlePathBottom" startOffset="50%" text-anchor="middle">
      ★ PVT. LTD. GURUGRAM ★
    </textPath>
  </text>
</svg>
`)}`;

/**
 * Utility to convert an uploaded image file (PNG, JPG, SVG) into a base64 Data URL.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
