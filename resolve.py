import re

def resolve_file(filepath, resolve_strategy='theirs_rebase'):
    with open(filepath, 'r') as f:
        content = f.read()

    # The format is:
    # <<<<<<< HEAD
    # (upstream / ours in rebase)
    # =======
    # (rebased branch / theirs in rebase)
    # >>>>>>> commit message

    def replacer(match):
        ours = match.group(1)
        theirs = match.group(2)
        if resolve_strategy == 'theirs_rebase':
            return theirs
        elif resolve_strategy == 'ours_rebase':
            return ours
        return theirs # default

    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> [^\n]+\n', re.DOTALL)
    
    new_content = pattern.sub(replacer, content)
    
    with open(filepath, 'w') as f:
        f.write(new_content)

resolve_file('src/app.ts', 'ours_rebase') 
resolve_file('src/interfaces/http/middleware/validate.middleware.ts', 'ours_rebase')
# Wait, let me double check which is which! 
# HEAD is the upstream (the new base, origin/main) in a rebase. 
# So taking HEAD ("ours") takes the "Enterprise Express Full" changes from origin/main.
# Let me verify what head has.
