#!/bin/bash

# 1. Ask for the number of commits
echo -n "How many commits do you want? "
read -r TARGET_COMMITS

if ! [[ "$TARGET_COMMITS" =~ ^[0-9]+$ ]] || [ "$TARGET_COMMITS" -le 0 ]; then
    echo "Please enter a valid number greater than 0."
    exit 1
fi

# 2. Get current branch name dynamically (e.g., main or master)
BRANCH=$(git branch --show-current)

# 3. Track all changed, modified, or untracked files
mapfile -t FILES < <(git status --porcelain | awk '{print $2}')
TOTAL_FILES=${#FILES[@]}

if [ "$TOTAL_FILES" -gt 0 ]; then
    git add -N . 2>/dev/null
fi

echo "Processing changes into exactly $TARGET_COMMITS commits..."

# 4. Loop and create the commits
for ((i=0; i<TARGET_COMMITS; i++)); do
    MSG=$(LC_ALL=C tr -dc 'a-z' < /dev/urandom | head -c 6)

    # Distribute files if available
    if [ $i -lt "$TOTAL_FILES" ]; then
        git add "${FILES[$i]}" 2>/dev/null
    fi

    # On the final commit, grab anything left over
    if [ $((i + 1)) -eq "$TARGET_COMMITS" ]; then
        git add . 2>/dev/null
    fi

    # Create the commit (allows empty commits as padding)
    git commit --allow-empty -m "$MSG"
done

# 5. Automatically push to the remote repository
echo "Pushing commits to origin $BRANCH..."
git push origin "$BRANCH"

echo "Done! Created and pushed $TARGET_COMMITS commits with random names."
