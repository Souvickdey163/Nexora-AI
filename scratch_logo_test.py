import os
import math
from PIL import Image, ImageDraw

# Create SVG content for Nexora AI Logo
def generate_svg(width=500, height=500):
    # Colors matching the original image
    blue_color = "#1263a8"  # Professional AI Blue
    black_color = "#0a0a0a" # Deep Black
    
    # We will construct an exact geometric vector representation
    # Center is at (250, 250)
    # The design consists of:
    # 1. Blue path (top-left motif)
    # 2. Black path (bottom-right motif, rotated 180 degrees)
    # 3. Blue circle at top inner socket
    # 4. Black circle at bottom inner socket
    
    # Let's define the paths using high-precision Bezier curves or SVG path commands
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 550" width="{width}" height="{height}">
  <style>
    .blue-fill {{ fill: {blue_color}; }}
    .black-fill {{ fill: {black_color}; }}
  </style>
  <g id="nexora-logo">
    <!-- Blue Ribbon (Left & Top) -->
    <path class="blue-fill" d="
      M 70,480 
      C 65,420 85,340 85,210
      C 85,100 150,35 245,35
      C 300,35 345,65 365,115
      C 375,140 370,165 350,175
      C 330,185 310,170 300,150
      C 290,120 265,95 235,95
      C 175,95 145,140 145,210
      C 145,290 145,330 185,370
      C 215,400 240,430 240,465
      C 240,490 220,510 195,510
      C 160,510 120,470 120,410
      C 120,330 120,220 120,210
      C 120,155 155,120 205,120
      " />
  </g>
</svg>'''
    return svg

print("Script template ready")
