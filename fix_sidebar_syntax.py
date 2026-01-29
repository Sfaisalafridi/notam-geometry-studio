path = 'frontend/src/components/Sidebar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We look for the broken block: `if (newUrl) {` appearing BEFORE `const errMsg` or `console.error`
# In the snippet, it's lines 111-114.
# We will filter out lines that match this specific broken pattern inside the catch block.

new_lines = []
skip = False
for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Identify the broken verification
    # It relies on `newUrl` but `newUrl` isn't defined yet.
    if 'if (newUrl) {' in stripped:
        # Check if newUrl was defined recently? 
        # In the broken file, it wasn't.
        # But we also have a VALID `if (newUrl)` later (line 124 in snippet).
        
        # Heuristic: If the NEXT few lines are valid loggers, this one is the ghost.
        # In snippet 1718:
        # 111: if (newUrl) {
        # 112:     localStorage...
        # 113:     window...
        # 114: }
        # 116: console.error(err);
        
        # So we remove this block if it precedes console.error(err)
        
        # Check context
        is_ghost = False
        if i + 5 < len(lines):
            for lookahead in lines[i:i+6]:
                if 'console.error(err)' in lookahead:
                    is_ghost = True
                    break
        
        if is_ghost:
            skip = True
    
    if skip:
        if '}' in stripped and stripped == '}':
            skip = False
        continue
        
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Fixed Syntax Error in Sidebar.tsx")
