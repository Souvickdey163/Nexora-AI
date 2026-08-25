import os
import subprocess

def create_logo_svg():
    # 180-degree symmetric design
    # Canvas 500x500
    # Blue: #1263a8 or #1062aa
    # Black: #0a0a0a
    
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <style>
      .blue-shape { fill: #1263a8; }
      .black-shape { fill: #0a0a0a; }
    </style>
  </defs>

  <g id="logo-group">
    <!-- BLUE HALF -->
    <g class="blue-shape">
      <!-- Blue Circle (Top Left Inner) -->
      <circle cx="195" cy="175" r="44" />

      <!-- Blue Ribbon Path -->
      <!-- Starts at bottom left tip, goes up, over top-left arch, down into center around black circle -->
      <path d="
        M 72,465 
        C 68,430 85,380 85,220 
        C 85,130 145,60 235,60 
        C 320,60 375,120 375,200 
        C 375,240 355,270 325,270 
        C 295,270 280,240 280,200 
        C 280,150 250,115 205,115 
        C 160,115 140,150 140,220 
        C 140,320 170,360 215,400 
        C 240,422 250,445 235,465 
        C 220,485 190,475 170,450 
        C 135,410 80,480 72,465 Z
      " />
    </g>

    <!-- BLACK HALF (Exact 180 degree rotation of Blue half around center 250,250) -->
    <use href="#blue-half-def" transform="rotate(180, 250, 250)" class="black-shape" />
  </g>
</svg>'''

    # Better structure: defs for half
    svg_content_with_def = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <g id="half">
      <!-- Circle -->
      <circle cx="192" cy="175" r="44" />
      
      <!-- Ribbon -->
      <path d="
        M 75,470
        C 70,420 85,350 85,210
        C 85,125 145,55 235,55
        C 315,55 365,110 365,185
        C 365,225 348,252 320,252
        C 292,252 278,225 278,185
        C 278,145 250,110 205,110
        C 160,110 140,145 140,210
        C 140,305 160,350 200,388
        C 230,416 242,438 230,458
        C 215,478 185,465 165,442
        C 130,402 82,482 75,470 Z
      " />
    </g>
  </defs>

  <!-- Blue Half -->
  <use href="#half" fill="#1263a8" />

  <!-- Black Half (Rotated 180° around 250,250) -->
  <use href="#half" transform="rotate(180 250 250)" fill="#0a0a0a" />
</svg>'''

    with open('/Users/souvickdey/Nexora/logo_candidate.svg', 'w') as f:
        f.write(svg_content_with_def)

create_logo_svg()
print("Saved logo_candidate.svg")
