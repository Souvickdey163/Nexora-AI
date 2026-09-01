import math

def generate_logo4():
    # Grid 500x500
    # 180° Rotational Symmetry around (250, 250)
    # Exact vector paths matching user image:
    
    # Landmark points:
    # Blue dot: cx=190, cy=180, r=42
    # Black dot: cx=310, cy=320, r=42
    
    # Ribbon thickness = 52
    # Gap = 12
    
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <style>
      .blue-color { fill: #1363a8; }
      .black-color { fill: #0a0a0a; }
    </style>
    <g id="blue-element">
      <!-- Blue Dot -->
      <circle cx="190" cy="180" r="42" class="blue-color" />

      <!-- Blue Ribbon -->
      <!-- Smooth path outline -->
      <path class="blue-color" d="
        M 76,430
        C 74,400 76,270 76,180
        A 114,114 0 0 1 304,180
        C 304,225 284,265 244,285
        C 214,300 184,330 184,370
        A 76,76 0 0 0 336,370
        C 336,340 324,315 304,295
        C 330,315 348,345 348,370
        A 88,88 0 0 1 172,370
        C 172,320 206,286 238,266
        C 270,246 288,215 288,180
        A 98,98 0 0 0 92,180
        L 92,390
        C 92,415 84,438 76,430 Z
      " />
    </g>
  </defs>

  <rect width="500" height="500" fill="#ffffff" />
  
  <use href="#blue-element" />

  <g transform="rotate(180 250 250)">
    <circle cx="190" cy="180" r="42" class="black-color" />
    <path class="black-color" d="
      M 76,430
      C 74,400 76,270 76,180
      A 114,114 0 0 1 304,180
      C 304,225 284,265 244,285
      C 214,300 184,330 184,370
      A 76,76 0 0 0 336,370
      C 336,340 324,315 304,295
      C 330,315 348,345 348,370
      A 88,88 0 0 1 172,370
      C 172,320 206,286 238,266
      C 270,246 288,215 288,180
      A 98,98 0 0 0 92,180
      L 92,390
      C 92,415 84,438 76,430 Z
    " />
  </g>
</svg>'''

    with open('/Users/souvickdey/Nexora/logo_candidate4.svg', 'w') as f:
        f.write(svg)

generate_logo4()
print("Saved logo_candidate4.svg")
