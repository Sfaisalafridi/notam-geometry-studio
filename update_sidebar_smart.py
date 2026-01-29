path = 'frontend/src/components/Sidebar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update API_BASE_URL definition to use localStorage
# We match the line we added previously
old_def = "const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grand-flow.up.railway.app';"
new_def = "const API_BASE_URL = (typeof window !== 'undefined' ? localStorage.getItem('custom_backend_url') : null) || import.meta.env.VITE_API_URL || 'https://grand-flow.up.railway.app';"

if old_def in text:
    text = text.replace(old_def, new_def)
else:
    # If exact match fails (whitespace?), try regex or just forceful replace of the previous logic
    # We'll just replace the import line again to be safe if the previous edit was slightly different
    text = text.replace("import type { Notam } from '../types';", 
                        "import type { Notam } from '../types';\n\n" + new_def)

# 2. Inject Prompt Logic in handleParse
# Find the catch block
catch_block = "setStatus('Parsing failed. Is backend running?');"
prompt_logic = """
            const newUrl = prompt("Backend connection failed! Please paste your Railway URL (e.g., https://grand-flow.up.railway.app):", "https://grand-flow.up.railway.app");
            if (newUrl) {
                localStorage.setItem('custom_backend_url', newUrl.replace(/\\/$/, ''));
                window.location.reload();
            }
            setStatus('Parsing failed. Is backend running?');
"""

if catch_block in text:
    text = text.replace(catch_block, prompt_logic)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Sidebar updated with Smart URL Prompt.")
