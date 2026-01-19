# Fish completions for generate-pdf

complete -c generate-pdf -l cv -d 'Path to resume markdown file' -r
complete -c generate-pdf -l coverletter -d 'Path to cover letter markdown file' -r
complete -c generate-pdf -s o -l output -d 'Output directory' -r -a '(__fish_complete_directories)'
complete -c generate-pdf -s h -l help -d 'Show help message'
