"""Validate the V2 structure, retained catalogue and local asset references."""
import json
import re
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / "projects.js").read_text()
projects = json.loads(raw.split("=", 1)[1].strip().removesuffix(";"))
project_ids = {p["id"] for p in projects}
assert len(project_ids) == len(projects), "Duplicate project IDs"
assert len(projects) == 13, "The original 13 project galleries must remain"
assert sum(len(p["images"]) for p in projects) == 55, "Original artwork missing"
assert sum(len(p.get("videos", [])) for p in projects) == 2, "Original film missing"
assert not (ROOT / "CNAME").exists(), "Unexpected custom domain configuration"
assets = set()
for project in projects:
    assert project["images"] and project["summary"] and project["title"]
    for image in [project["cover"], *project["images"]]:
        assert image["alt"] and image["width"] > 0 and image["height"] > 0
        assets.update([image["src"], image["thumb"]] if image == project["cover"] else [image["src"]])
    for video in project.get("videos", []):
        assets.update([video["src"], video["poster"]])

def add_asset(value, base=ROOT):
    """Resolve local URLs without query strings or fragment identifiers."""
    value = value.strip()
    if not value or value.startswith("#"):
        return
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return
    assert not parsed.path.startswith("/"), f"Root-relative URL breaks Pages: {value}"
    path = (base / unquote(parsed.path)).resolve()
    assert path.is_relative_to(ROOT), f"Asset outside site directory: {value}"
    assets.add(path.relative_to(ROOT).as_posix())


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = {}
        self.h1_count = 0
        self.nav_count = 0
        self.project_links = []
        self.fragment_links = []
        self.stylesheets = set()
        self.position = 0

    def handle_starttag(self, tag, attrs):
        self.position += 1
        attributes = dict(attrs)
        if tag == "h1":
            self.h1_count += 1
        if tag == "nav":
            self.nav_count += 1
        if "id" in attributes:
            identifier = attributes["id"]
            assert identifier not in self.ids, f"Duplicate HTML ID: {identifier}"
            self.ids[identifier] = self.position
        if tag == "link" and "stylesheet" in attributes.get("rel", "").split():
            self.stylesheets.add(attributes["href"])
        for name, value in attrs:
            if not value:
                continue
            if name == "srcset":
                for candidate in value.split(","):
                    add_asset(candidate.strip().split()[0])
            elif name in {"src", "href", "poster"}:
                if value.startswith("#project/"):
                    project_id = unquote(value.split("/", 1)[1])
                    assert project_id in project_ids, f"Unknown project: {project_id}"
                    self.project_links.append((self.position, project_id))
                elif value.startswith("#"):
                    self.fragment_links.append(value[1:])
                else:
                    add_asset(value)


page = Links()
page.feed((ROOT / "index.html").read_text())
assert page.h1_count == 1, "Use one portfolio H1"
assert page.nav_count == 1, "Use one main navigation"
chapters = ["paper-riot", "electric-playground", "hyperdream"]
assert all(chapter in page.ids for chapter in chapters), "Missing a visual world"
positions = [page.ids[chapter] for chapter in chapters]
assert positions == sorted(positions), "Visual worlds are out of order"
featured = set()
for start, end in zip(positions, positions[1:]):
    interlude = {project_id for position, project_id in page.project_links if start < position < end}
    assert len(interlude) >= 4, "Each interlude needs at least four original projects"
    featured.update(interlude)
assert len(featured) >= 8, "Eight different original projects must connect the worlds"
for target in page.fragment_links:
    assert not target or target in page.ids, f"Broken section link: #{target}"

for stylesheet in page.stylesheets:
    parsed = urlsplit(stylesheet)
    if parsed.scheme or parsed.netloc:
        continue
    css_path = ROOT / unquote(parsed.path)
    css = css_path.read_text()
    for match in re.finditer(r"url\(\s*(['\"]?)(.*?)\1\s*\)", css, re.IGNORECASE):
        add_asset(match.group(2), css_path.parent)

for world in ("paper", "electric", "hyperdream"):
    assets.update({f"assets/world-{world}.webp", f"assets/world-{world}-small.webp"})

for asset in assets:
    path = ROOT / asset
    assert path.is_file() and path.stat().st_size > 0, f"Missing or empty: {asset}"
print(f"PASS: three worlds in order, one H1/navigation, {len(featured)} featured projects, "
      f"{len(projects)} galleries, {len(assets)} local assets and no custom domain.")
