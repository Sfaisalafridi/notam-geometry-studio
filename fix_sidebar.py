path = 'frontend/src/components/Sidebar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Define const
if 'const API_BASE_URL' not in text:
    text = text.replace("import type { Notam } from '../types';", 
                        "import type { Notam } from '../types';\n\nconst API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grand-flow.up.railway.app';")

# Replace URLs
# Using backticks for template literals in JS
kml_replacement = "`" + "${API_BASE_URL}/api/export/kml" + "`"
parse_replacement = "`" + "${API_BASE_URL}/api/parse" + "`"

text = text.replace("'https://web-production-8c73.up.railway.app/api/export/kml'", kml_replacement)
text = text.replace('"https://web-production-8c73.up.railway.app/api/parse"', parse_replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Sidebar updated successfully.")
