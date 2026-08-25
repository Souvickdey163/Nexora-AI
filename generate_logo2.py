import math

def generate_precise_svg():
    # Grid 500x500
    # Center (250, 250)
    # Colors:
    # Blue: #1263a8
    # Black: #0a0a0a
    
    # We construct the Blue half as a stroke or filled path with precise arcs
    # Let's use SVG path with exact geometric arc and bezier definitions
    
    # Landmark coordinates:
    # Top-left circle (Blue Dot): center (185, 175), radius 38
    # Bottom-right circle (Black Dot): center (315, 325), radius 38
    
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <!-- Combined Blue Half -->
    <g id="blue-half">
      <!-- Blue Dot -->
      <circle cx="180" cy="170" r="38" fill="#1263a8" />
      
      <!-- Blue Ribbon -->
      <path fill="#1263a8" d="
        M 80,440
        C 75,410 95,350 95,210
        A 90,90 0 0 1 275,210
        C 275,260 250,290 220,320
        C 180,360 145,395 180,445
        C 210,488 270,470 290,420
        C 305,380 290,340 255,305
        C 220,270 215,240 215,210
        A 30,30 0 0 0 155,210
        C 155,330 135,390 140,420
        C 142,435 130,460 105,465
        C 90,468 82,455 80,440 Z
      " />
    </g>
  </defs>

  <!-- Background for crisp contrast verification -->
  <rect width="500" height="500" fill="#ffffff" />

  <!-- Blue Half -->
  <use href="#blue-half" />

  <!-- Black Half (Rotated 180° around 250,250) -->
  <g transform="rotate(180 250 250)">
    <!-- Replace fill with black for black half -->
    <circle cx="180" cy="170" r="38" fill="#0a0a0a" />
    <path fill="#0a0a0a" d="
      M 80,440
      C 75,410 95,350 95,210
      A 90,90 0 0 1 275,210
      C 275,260 250,290 220,320
      C 180,360 145,395 180,445
      C 210,488 270,470 290,420
      C 305,380 290,340 255,305
      C 220,270 215,240 215,210
      A 30,30 0 0 0 155,210
      C 155,330 135,390 140,420
      C 142,435 130,460 105,465
      C 90,468 82,455 80,440 Z
    " />
  </g>
</svg>'''

    with open('/Users/souvickdey/Nexora/logo_candidate2.svg', 'w') as f:
        f.write(svg)

generate_precise_svg()
print("Saved logo_candidate2.svg")
