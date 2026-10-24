"""Validate the portfolio catalogue and all local asset references."""
import json
import re
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / "projects.js").read_text()
projects = json.loads(raw.split("=", 1)[1].strip().removesuffix(";"))
assert len({p["id"] for p in projects}) == len(projects), "Duplicate project IDs"
assert not (ROOT / "CNAME").exists(), "Unexpected custom domain configuration"
assets = set()
for project in projects:
    assert project["images"] and project["summary"] and project["title"]
    for image in [project["cover"], *project["images"]]:
        assert image["alt"] and image["width"] > 0 and image["height"] > 0
        assets.update([image["src"], image["thumb"]] if image == project["cover"] else [image["src"]])
    for video in project.get("videos", []):
        assets.update([video["src"], video["poster"]])

class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name not in {"src", "href"} or not value:
                continue
            if value.startswith("#project/"):
                assert value.split("/", 1)[1] in {p["id"] for p in projects}
            elif not value.startswith(("#", "http", "mailto:")):
                assets.add(value)

Links().feed((ROOT / "index.html").read_text())
for asset in assets:
    path = ROOT / asset
    assert path.is_file() and path.stat().st_size > 0, f"Missing or empty: {asset}"
assert not re.search(r"(?:src|href)=[\"']/assets/", (ROOT / "index.html").read_text())
print(f"PASS: {len(projects)} projects, {len(assets)} local assets, valid source paths and no custom domain.")
