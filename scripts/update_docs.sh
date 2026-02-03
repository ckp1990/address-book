#!/bin/bash

# This script generates a CHANGELOG.md file based on git commit history
# and ensures it is referenced in the USER_GUIDE.md.

echo "Generating CHANGELOG.md..."

echo "# Changelog" > CHANGELOG.md
echo "" >> CHANGELOG.md
echo "All notable changes to this project will be documented in this file." >> CHANGELOG.md
echo "" >> CHANGELOG.md

# Get git log in a readable format
git log --pretty=format:"### %ad - %s%n%b%n" --date=short >> CHANGELOG.md

echo "CHANGELOG.md updated."

# Check if USER_GUIDE.md references CHANGELOG.md
if grep -q "CHANGELOG.md" USER_GUIDE.md; then
    echo "USER_GUIDE.md already references CHANGELOG.md."
else
    echo "Adding reference to CHANGELOG.md in USER_GUIDE.md..."
    echo "" >> USER_GUIDE.md
    echo "## Recent Updates" >> USER_GUIDE.md
    echo "" >> USER_GUIDE.md
    echo "For a list of recent changes and updates to the application, please refer to the [Changelog](CHANGELOG.md)." >> USER_GUIDE.md
    echo "Reference added."
fi

echo "Documentation update complete."
