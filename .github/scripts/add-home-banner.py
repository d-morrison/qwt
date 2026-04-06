#!/usr/bin/env python3
"""
Script to add a banner to each page linking to its alternative formats.
"""

import os
import sys
import json
import re
from pathlib import Path

def add_page_banner(html_path, html_dir):
    """Add a banner to a page with links to its DOCX and RevealJS versions."""
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Calculate the relative path from html_dir
    try:
        rel_path = html_path.relative_to(html_dir)
    except ValueError:
        print(f"Warning: {html_path} is not under {html_dir}", file=sys.stderr)
        return
    
    # Get the stem (filename without extension)
    stem = html_path.stem
    
    # Construct paths to alternative formats relative to the HTML file's directory
    docx_file = f"{stem}.docx"
    docx_tracked_file = f"{stem}-tracked-changes.docx"
    slides_file = f"{stem}-slides.html"
    
    # Build the banner with links to alternative formats
    links = []
    
    # Check if DOCX file exists (it should for all pages)
    docx_path = html_path.parent / docx_file
    if docx_path.exists():
        links.append(f'<a href="{docx_file}" download>📄 MS Word</a>')
    
    # Check if tracked changes DOCX exists
    docx_tracked_path = html_path.parent / docx_tracked_file
    if docx_tracked_path.exists():
        links.append(f'<a href="{docx_tracked_file}" download>📝 MS Word (tracked changes)</a>')
    
    # Check if slides file exists
    slides_path = html_path.parent / slides_file
    if slides_path.exists():
        links.append(f'<a href="{slides_file}">🎞️ Slides</a>')
    
    # Only add banner if there are alternative formats available
    if not links:
        print(f"  No alternative formats found for {rel_path}")
        return
    
    links_html = ' | '.join(links)
    
    banner = f'''
<div class="preview-page-formats-banner" style="background-color: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 4px; padding: 12px; margin: 16px 0;">
    <p style="margin: 0;">
        <strong>📋 Other Formats:</strong> {links_html}
    </p>
</div>
'''
    
    # Find insertion point (after <main> tag)
    main_match = re.search(r'(<main[^>]*>)', html)
    if main_match:
        insertion_point = main_match.end()
        html = html[:insertion_point] + banner + html[insertion_point:]
        
        # Write back
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"  Added format banner to {rel_path} with {len(links)} format(s)")
    else:
        print(f"  Could not find insertion point for {rel_path}", file=sys.stderr)

def main():
    # Get the HTML directory
    html_dir = Path(os.getenv('HTML_DIR', './_site'))
    
    if not html_dir.exists():
        print(f"HTML directory {html_dir} does not exist", file=sys.stderr)
        return
    
    print("="*60)
    print("Adding Format Banners to Pages")
    print("="*60)
    
    # Find all HTML files recursively
    html_files = list(html_dir.rglob('*.html'))
    
    if not html_files:
        print(f"No HTML files found in {html_dir}")
        return
    
    print(f"\nFound {len(html_files)} HTML file(s) to process")
    
    # Process each HTML file
    for html_file in html_files:
        add_page_banner(html_file, html_dir)
    
    print("\n" + "="*60)
    print("Format banner addition complete")
    print("="*60)

if __name__ == '__main__':
    main()
