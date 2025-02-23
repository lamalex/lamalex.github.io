---
title: "PDF Generation in GitHub Actions"
description: "Automating PDF generation from Jupyter notebooks using GitHub Actions and nbconvert"
pubDate: 2020-09-11
tags: ["github actions", "pdf", "latex", "ci/cd"]
---

## PDF Generation in GitHub Actions

I've been using GitHub Actions to generate PDF files for my homework assignments. I'm using Jupyter notebooks for my assignments, and I'm using GitHub Pages to host them. I'm also using GitHub Actions to convert my notebooks to PDF files and upload them to GitHub releases.

### The Problem

I'm taking a class that requires me to submit my assignments as PDF files. I'm writing my assignments in Jupyter notebooks, and I want to be able to generate PDF files from them. I also want to be able to host my assignments on GitHub Pages so that I can share them with my professor and classmates.

### The Solution

I'm using GitHub Actions to generate PDF files from my Jupyter notebooks. I'm using nbconvert to convert my notebooks to PDF files, and I'm using GitHub Actions to upload the PDF files to GitHub releases.

### The Code

Here's the GitHub Actions workflow that I'm using:

```yaml
name: Build and Deploy
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          persist-credentials: false

      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.8'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install jupyter nbconvert
          sudo apt-get install texlive-xetex texlive-fonts-recommended texlive-plain-generic

      - name: Convert notebooks to PDF
        run: |
          for file in *.ipynb; do
            jupyter nbconvert --to pdf "$file"
          done

      - name: Create Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.sha }}
          release_name: Release ${{ github.sha }}
          draft: false
          prerelease: false

      - name: Upload Release Asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./homework1.pdf
          asset_name: homework1.pdf
          asset_content_type: application/pdf

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@3.5.9
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BRANCH: gh-pages
          FOLDER: .
```

### The Results

I'm pretty happy with how this turned out. I'm able to write my assignments in Jupyter notebooks, and I'm able to keep them organized in GitHub. I'm also able to generate PDF files for my assignments, which is a requirement for my class. I'm also able to host my assignments on GitHub Pages, which makes it easy to share them with my professor and classmates.

### Future Improvements

I'd like to add the following features:

- [ ] Add a table of contents to the PDF files
- [ ] Add a cover page to the PDF files
- [ ] Add a bibliography to the PDF files
- [ ] Add a license to the PDF files
- [ ] Add a footer to the PDF files
- [ ] Add a header to the PDF files
- [ ] Add a watermark to the PDF files
- [ ] Add a signature to the PDF files
- [ ] Add a timestamp to the PDF files
- [ ] Add a version number to the PDF files

### Conclusion

I'm pretty happy with how this turned out. I'm able to write my assignments in Jupyter notebooks, and I'm able to keep them organized in GitHub. I'm also able to generate PDF files for my assignments, which is a requirement for my class. I'm also able to host my assignments on GitHub Pages, which makes it easy to share them with my professor and classmates.
