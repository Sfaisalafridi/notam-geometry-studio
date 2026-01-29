path = 'frontend/src/components/Sidebar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. REMOVE OLD PROMPT LOGIC specifically
# We look for the specific prompt string
old_prompt = 'const newUrl = prompt("Backend connection failed! Please paste your Railway URL (e.g., https://grand-flow.up.railway.app):", "https://grand-flow.up.railway.app");'
if old_prompt in text:
    text = text.replace(old_prompt, '')

# 2. MATCH AND REPLACE THE STATUS UPDATE
# Targeted string
target_str = "setStatus('Parsing failed. Is backend running?');"

# New Logic with Backticks meant for JS
# We construct it carefully
js_backtick = "`"
new_logic = """
            console.error(err);
            const errMsg = axios.isAxiosError(err) 
                ? {bt}Connection Error: ${{err.response?.status || 'Network Failed'}} at ${{API_BASE_URL}}{bt}
                : {bt}Error: ${{String(err)}}{bt};
            
            setStatus(errMsg);
            
            const newUrl = prompt({bt}CONNECTION FAILED! \\nDetails: ${{errMsg}}\\n\\nPlease verify your Railway URL and paste it below:{bt}, API_BASE_URL);
            if (newUrl) {{
                localStorage.setItem('custom_backend_url', newUrl.replace(/\/$/, ''));
                window.location.reload();
            }}
""".format(bt=js_backtick)

if target_str in text:
    text = text.replace(target_str, new_logic)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated Sidebar with Granular Debugging")
