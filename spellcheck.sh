#!/bin/bash

for f in content/**/*.md; do 
    echo $f:; 
    aspell -M list < $f | while read word; 
        do echo $word
        grep -n $word $f;
    done 
    echo '';
done