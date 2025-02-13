#!/bin/bash

# Exit early
# See: https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#The-Set-Builtin
set -e

# About: This script updates copyright notices in files.
# Usage: ./script/copyright <directory>

# Define the copyright notice
readonly COPYRIGHT_NOTICE="
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the \"License\");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an \"AS IS\" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
"

# Define supported extensions and their comment styles
declare -A COMMENT_STYLES=(
    ["sh"]="#"
    ["py"]="#"
    ["js"]="/*"
    ["ts"]="/*"
    ["java"]="/*"
    ["cpp"]="/*"
    ["hpp"]="/*"
    ["c"]="/*"
    ["h"]="/*"
    ["cs"]="/*"
    ["go"]="/*"
    ["swift"]="/*"
    ["php"]="/*"
    ["rb"]="#"
)

# Function to check if a file should be ignored
should_ignore_file() {
    local file="$1"

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

    if [[ "$style" == "/*" ]]; then
        echo -e "/*$COPYRIGHT_NOTICE */
"
    else
        echo -e "${COPYRIGHT_NOTICE//^/$style}" | sed 's/^/$/'
    fi
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
        echo -e "$formatted_notice"
        cat "$file"
    } > temp_file && mv temp_file "$file"

    echo -e "Updated: $file"
}

# Main function to scan a directory and update files
scan_directory() {
    local dir="$1"

    find "$dir" -type f | while read -r file; do
        # Skip ignored files and directories
        echo -e "checking $file"
        should_ignore_file "$file" || prepend_copyright "$file"
    done
}

# Ensure a directory argument is provided
[[ $# -ne 1 ]] && {
    echo "Usage: $0 <directory>"
    exit 1
}

echo -e "Processing..."
scan_directory "$1"
echo -e "Processing complete."
