#!/bin/bash
echo -n "How many commits do you want? "
read -r TARGET_COMMITS
if ! [[ "$TARGET_COMMITS" =~ ^[0-9]+$ ]] || [ "$TARGET_COMMITS" -le 0 ]; then
    echo "Please enter a valid number greater than 0."
    exit 1
fi
BRANCH=$(git branch --show-current)
mapfile -t FILES < <(git status --porcelain | awk '{print $2}')
TOTAL_FILES=${#FILES[@]}
[ "$TOTAL_FILES" -gt 0 ] && git add -N . 2>/dev/null
echo "Processing changes into exactly $TARGET_COMMITS commits..."
for ((i=0; i<TARGET_COMMITS; i++)); do
    MSG=$(LC_ALL=C tr -dc 'a-z' < /dev/urandom | head -c 6)
    [ $i -lt "$TOTAL_FILES" ] && git add "${FILES[$i]}" 2>/dev/null
    [ $((i + 1)) -eq "$TARGET_COMMITS" ] && git add . 2>/dev/null
    git commit --allow-empty -m "$MSG"
done
echo "Pushing commits to origin $BRANCH..."
git push origin "$BRANCH"
echo "Done! Created and pushed $TARGET_COMMITS commits with random names."
