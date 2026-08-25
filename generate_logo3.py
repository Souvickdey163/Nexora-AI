import math

def generate_logo3():
    # Grid 500x500
    # Center (250, 250)
    # 180° Rotational Symmetry
    
    cx_blue, cy_blue = 200, 180
    cx_black, cy_black = 300, 320
    
    r_dot = 46
    gap = 14
    w_ribbon = 60
    
    r_inner = r_dot + gap # 60
    r_outer = r_inner + w_ribbon # 120
    
    # Blue Dot: cx=200, cy=180, r=46
    # Blue Arch around top-left (centered at 200,180):
    # Left outer = 200 - 120 = 80
    # Left inner = 200 - 60 = 140
    # Top outer = 180 - 120 = 60
    # Top inner = 180 - 60 = 120
    
    # Blue U-bend around Black Dot (centered at 300, 320):
    # Comes down from top arch into black dot area.
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <!-- Single Symmetric Half -->
    <g id="blue-half">
      <!-- Blue Dot -->
      <circle cx="{cx_blue}" cy="{cy_blue}" r="{r_dot}" fill="#1263a8" />

      <!-- Blue Ribbon -->
      <!-- Path starts at bottom-left tip (78, 440) -->
      <!-- Goes up left vertical: x=78 down to y=180 -->
      <!-- Arc over top-left: from (78,180) to (320,180) A 122,122 0 0 0 -->
      <!-- Curves down right side, then wraps U-turn under black dot at (300,320) -->
      <path fill="#1263a8" d="
        M 78,440
        C 75,410 78,300 78,180
        A 122,122 0 0 1 322,180
        C 322,230 310,270 290,300
        C 270,330 240,340 210,320
        C 180,300 170,260 170,220
        C 170,195 180,180 200,180
        C 215,180 225,195 225,215
        C 225,245 240,265 260,265
        C 275,265 285,250 285,230
        C 285,180 250,120 200,120
        A 62,62 0 0 0 138,180
        L 138,390
        C 138,420 110,460 78,440 Z
      " />
    </g>
  </defs>

  <!-- White background for testing -->
  <rect width="500" height="500" fill="#ffffff" />

  <!-- Blue Half -->
  <use href="#blue-half" />

  <!-- Black Half (Rotated 180° around center 250,250) -->
  <use href="#blue-half" transform="rotate(180 250 250)" fill="#0a0a0a" />
</svg>'''

    # Exact geometrically built path:
    # Let's build candidate 3 with exact SVG arc commands
    svg_exact = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <style>
      .blue-color {{ fill: #1263a8; }}
      .black-color {{ fill: #0a0a0a; }}
    </style>
    <g id="blue-shape">
      <!-- Top Blue Dot -->
      <circle cx="200" cy="180" r="46" class="blue-color" />

      <!-- Blue Ribbon -->
      <path class="blue-color" d="
        M 78,435
        C 75,410 78,280 78,180
        A 122,122 0 0 1 322,180
        L 322,230
        C 322,290 300,320 270,340
        C 240,360 210,340 195,310
        C 180,280 185,250 205,235
        C 220,225 238,235 238,255
        C 238,275 250,290 270,280
        C 285,270 292,250 292,225
        L 292,180
        A 92,92 0 0 0 108,180
        L 108,385
        C 108,415 90,445 78,435 Z
      " />
    </g>
  </defs>

  <rect width="500" height="500" fill="#ffffff" />
  
  <use href="#blue-shape" />
  
  <!-- Rotated 180° and recolored to black -->
  <g transform="rotate(180 250 250)">
    <circle cx="200" cy="180" r="46" class="black-color" />
    <path class="black-color" d="
      M 78,435
      C 75,410 78,280 78,180
      A 122,122 0 0 1 322,180
      L 322,230
      C 322,290 300,320 270,340
      C 240,360 210,340 195,310
      C 180,280 185,250 205,235
      C 220,225 238,235 238,255
      C 238,275 250,290 270,280
      C 285,270 292,250 292,225
      L 292,180
      A 92,92 0 0 0 108,180
      L 108,385
      C 108,415 90,445 78,435 Z
    " />
  </g>
</svg>'''

    with open('/Users/souvickdey/Nexora/logo_candidate3.svg', 'w') as f:
        f.write(svg_exact)

generate_logo3()
print("Saved logo_candidate3.svg")
