#!/bin/bash

function spellcheck_content() {
    for f in content/**/*.md; do
        echo '####' $f:;
        aspell -M --ignore 2 --add-extra-dicts=./custom-dictionary.txt list < $f | while read word;
            do echo **$word**
            grep -n $word $f;
        done
        echo '';
    done
}

spelling_errors=$(spellcheck_content)
json=$(jq -n --arg msg "$spelling_errors" '{body: $msg}')

curl -H  "Authorization: token ${GH_TOKEN}" -X POST \
        -d "$json" \
        "https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments"
