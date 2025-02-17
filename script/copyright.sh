#!/bin/bash

# Exit early on error
set -e

# Define the copyright notice (without comment style)
readonly COPYRIGHT_NOTICE="Copyright 2025 Robert Lindley

Licensed under the Apache License, Version 2.0 (the \"License\");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an \"AS IS\" BASIS,
without warranties or conditions of any kind, either express or implied.
See the License for the specific language governing permissions and
limitations under the License."

# Define supported extensions and their comment styles
declare -A COMMENT_STYLES=(
    ["c"]="//"
    ["cpp"]="//"
    ["cs"]="//"
    ["go"]="//"
    ["h"]="//"
    ["hpp"]="//"
    ["java"]="//"
    ["js"]="//"
    ["php"]="//"
    ["py"]="#"
    ["rb"]="#"
    ["sh"]="#"
    ["swift"]="//"
    ["ts"]="//"
    ["yaml"]="#"
    ["yml"]="#"
)

# Function to check if a file or directory should be ignored
should_ignore_file() {
    local file="$1"

    # Normalize path to remove leading './'
    file="${file#./}"

    # Check if the file is within the .git directory
    if [[ "$file" == ".git" || "$file" == ".git/"* || "$file" =~ ^\.git(/|$) ]]; then
        return 0
    fi

    # Check if the file is ignored by .gitignore
    git check-ignore -q "$file" && return 0

    # Check if the file is an ESLint configuration
    [[ "$file" == *".eslintrc"* || "$file" == "eslint.config."* ]] && return 0

    return 1
}

# Function to get the comment style for a file
get_comment_style() {
    local file="$1"
    local ext="${file##*.}"

    echo -e "${COMMENT_STYLES[$ext]:-}"
}

# Function to format the copyright notice with the correct comment style
format_copyright_notice() {
    local style="$1"

    if [[ -z "$style" ]]; then
        echo "Error: Unsupported file type. Skipping." >&2
        return 1
    fi

    echo -e "${COPYRIGHT_NOTICE//^/$style}" | sed 's/^/$/'
}

# Function to prepend the copyright notice to a file
prepend_copyright() {
    local file="$1"
    local comment_style
    comment_style=$(get_comment_style "$file")

    # Skip unsupported files
    [[ -z "$comment_style" ]] && return

    # Skip files that already contain the copyright
    grep -q "Copyright 2025 Robert Lindley" "$file" && return

    local formatted_notice
    formatted_notice=$(format_copyright_notice "$comment_style")

    # Prepend the copyright notice
    {
        echo -e "$formatted_notice\n"
        cat "$file"
    } >temp_file && mv temp_file "$file"

    echo -e "Updated: $file"
}

# Main function to scan a directory and update files
scan_directory() {
    local dir="$1"

    find "$dir" -type f | while read -r file; do
        # Skip ignored files and directories
        should_ignore_file "$file" || prepend_copyright "$file"
    done
}

# Ensure a directory argument is provided
if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

echo -e "Processing..."
scan_directory "$1"
echo -e "Processing complete."
