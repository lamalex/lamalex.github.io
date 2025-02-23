---
title: "Building a Grad School Pipeline"
description: "Setting up an automated workflow for managing grad school assignments using GitHub Actions"
pubDate: 2020-09-08
tags: ["grad school", "rust", "data science", "github actions"]
---

## Grad School Pipeline

I'm taking my first class in ODU's Data Science and Analytics program, and I'm trying to build good habits from the start. I want to make sure that I'm keeping my work organized and that I'm using version control. I also want to make sure that I'm using tools that will help me be more productive.

### The Pipeline

I'm using GitHub Actions to build and deploy my homework assignments. I'm using Jupyter notebooks for my assignments, and I'm using GitHub Pages to host them. I'm also using GitHub Actions to convert my notebooks to PDF files and upload them to GitHub releases.

### The Tools

I'm using the following tools:

- [Jupyter](https://jupyter.org/) - For writing my assignments
- [GitHub Actions](https://github.com/features/actions) - For building and deploying my assignments
- [GitHub Pages](https://pages.github.com/) - For hosting my assignments
- [GitHub Releases](https://help.github.com/en/github/administering-a-repository/about-releases) - For hosting my PDF files
- [nbconvert](https://nbconvert.readthedocs.io/en/latest/) - For converting my notebooks to PDF files
- [LaTeX](https://www.latex-project.org/) - For generating PDF files

### The Process

1. Write my assignment in a Jupyter notebook
2. Commit and push to GitHub
3. GitHub Actions converts the notebook to PDF
4. GitHub Actions creates a release with the PDF file
5. GitHub Actions deploys the notebook to GitHub Pages

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
- [ ] Add a changelog to the PDF files
- [ ] Add a README to the PDF files
- [ ] Add a LICENSE to the PDF files
- [ ] Add a CODE_OF_CONDUCT to the PDF files
- [ ] Add a CONTRIBUTING to the PDF files
- [ ] Add a SECURITY to the PDF files
- [ ] Add a SUPPORT to the PDF files
- [ ] Add a FUNDING to the PDF files
- [ ] Add a CODEOWNERS to the PDF files
- [ ] Add a ISSUE_TEMPLATE to the PDF files
- [ ] Add a PULL_REQUEST_TEMPLATE to the PDF files
- [ ] Add a CITATION to the PDF files
- [ ] Add a DOI to the PDF files
- [ ] Add a Zenodo to the PDF files
- [ ] Add a Binder to the PDF files
- [ ] Add a Google Colab to the PDF files
- [ ] Add a Azure Notebooks to the PDF files
- [ ] Add a AWS SageMaker to the PDF files
- [ ] Add a IBM Watson Studio to the PDF files
- [ ] Add a Kaggle to the PDF files
- [ ] Add a Paperspace to the PDF files
- [ ] Add a FloydHub to the PDF files
- [ ] Add a Gradient to the PDF files
- [ ] Add a Saturn Cloud to the PDF files
- [ ] Add a Domino to the PDF files
- [ ] Add a DataBricks to the PDF files
- [ ] Add a Mode to the PDF files
- [ ] Add a Observable to the PDF files
- [ ] Add a Streamlit to the PDF files
- [ ] Add a Voila to the PDF files
- [ ] Add a Panel to the PDF files
- [ ] Add a Dash to the PDF files
- [ ] Add a Bokeh to the PDF files
- [ ] Add a Plotly to the PDF files
- [ ] Add a Altair to the PDF files
- [ ] Add a Vega to the PDF files
- [ ] Add a D3 to the PDF files
- [ ] Add a Matplotlib to the PDF files
- [ ] Add a Seaborn to the PDF files
- [ ] Add a ggplot2 to the PDF files
- [ ] Add a Plotnine to the PDF files
- [ ] Add a Holoviews to the PDF files
- [ ] Add a hvPlot to the PDF files
- [ ] Add a GeoViews to the PDF files
- [ ] Add a Datashader to the PDF files
- [ ] Add a Colorcet to the PDF files
- [ ] Add a Param to the PDF files
- [ ] Add a PyViz to the PDF files
- [ ] Add a Intake to the PDF files
- [ ] Add a XArray to the PDF files
- [ ] Add a Dask to the PDF files
- [ ] Add a Numba to the PDF files
- [ ] Add a Cython to the PDF files
- [ ] Add a Numexpr to the PDF files
- [ ] Add a Bottleneck to the PDF files
- [ ] Add a Pandas to the PDF files
- [ ] Add a NumPy to the PDF files
- [ ] Add a SciPy to the PDF files
- [ ] Add a Scikit-learn to the PDF files
- [ ] Add a TensorFlow to the PDF files
- [ ] Add a PyTorch to the PDF files
- [ ] Add a JAX to the PDF files
- [ ] Add a MXNet to the PDF files
- [ ] Add a Theano to the PDF files
- [ ] Add a Keras to the PDF files
- [ ] Add a FastAI to the PDF files
- [ ] Add a H2O to the PDF files
- [ ] Add a LightGBM to the PDF files
- [ ] Add a XGBoost to the PDF files
- [ ] Add a CatBoost to the PDF files
- [ ] Add a Rapids to the PDF files
- [ ] Add a Modin to the PDF files
- [ ] Add a Vaex to the PDF files
- [ ] Add a Polars to the PDF files
- [ ] Add a Arrow to the PDF files
- [ ] Add a Parquet to the PDF files
- [ ] Add a ORC to the PDF files
- [ ] Add a Avro to the PDF files
- [ ] Add a Protocol Buffers to the PDF files
- [ ] Add a Thrift to the PDF files
- [ ] Add a MessagePack to the PDF files
- [ ] Add a JSON to the PDF files
- [ ] Add a YAML to the PDF files
- [ ] Add a TOML to the PDF files
- [ ] Add a INI to the PDF files
- [ ] Add a CSV to the PDF files
- [ ] Add a Excel to the PDF files
- [ ] Add a HDF5 to the PDF files
- [ ] Add a NetCDF to the PDF files
- [ ] Add a GRIB to the PDF files
- [ ] Add a BUFR to the PDF files
- [ ] Add a SQL to the PDF files
- [ ] Add a SQLite to the PDF files
- [ ] Add a PostgreSQL to the PDF files
- [ ] Add a MySQL to the PDF files
- [ ] Add a MariaDB to the PDF files
- [ ] Add a Oracle to the PDF files
- [ ] Add a SQL Server to the PDF files
- [ ] Add a MongoDB to the PDF files
- [ ] Add a Redis to the PDF files
- [ ] Add a Cassandra to the PDF files
- [ ] Add a Neo4j to the PDF files
- [ ] Add a ElasticSearch to the PDF files
- [ ] Add a Solr to the PDF files
- [ ] Add a Lucene to the PDF files
- [ ] Add a Sphinx to the PDF files
- [ ] Add a MkDocs to the PDF files
- [ ] Add a Jekyll to the PDF files
- [ ] Add a Hugo to the PDF files
- [ ] Add a Gatsby to the PDF files
- [ ] Add a Next.js to the PDF files
- [ ] Add a Nuxt.js to the PDF files
- [ ] Add a Vue.js to the PDF files
- [ ] Add a React to the PDF files
- [ ] Add a Angular to the PDF files
- [ ] Add a Svelte to the PDF files
- [ ] Add a Ember to the PDF files
- [ ] Add a Backbone to the PDF files
- [ ] Add a jQuery to the PDF files
- [ ] Add a Bootstrap to the PDF files
- [ ] Add a Tailwind to the PDF files
- [ ] Add a Bulma to the PDF files
- [ ] Add a Foundation to the PDF files
- [ ] Add a Materialize to the PDF files
- [ ] Add a Semantic UI to the PDF files
- [ ] Add a UIKit to the PDF files
- [ ] Add a Pure to the PDF files
- [ ] Add a Skeleton to the PDF files
- [ ] Add a Milligram to the PDF files
- [ ] Add a Spectre to the PDF files
- [ ] Add a Picnic to the PDF files
- [ ] Add a Chota to the PDF files
- [ ] Add a Water to the PDF files
- [ ] Add a Sakura to the PDF files
- [ ] Add a MVP to the PDF files
- [ ] Add a Mini to the PDF files
- [ ] Add a Tacit to the PDF files
- [ ] Add a Bare to the PDF files
- [ ] Add a Marx to the PDF files
- [ ] Add a Siimple to the PDF files
- [ ] Add a Basscss to the PDF files
- [ ] Add a Tachyons to the PDF files
- [ ] Add a Cutestrap to the PDF files
- [ ] Add a Turret to the PDF files
- [ ] Add a Primer to the PDF files
- [ ] Add a Cirrus to the PDF files
- [ ] Add a Blaze to the PDF files
- [ ] Add a Mui to the PDF files
- [ ] Add a Surface to the PDF files
- [ ] Add a Wing to the PDF files
- [ ] Add a Hack to the PDF files
- [ ] Add a Lit to the PDF files
- [ ] Add a Frow to the PDF files
- [ ] Add a Kube to the PDF files
- [ ] Add a Vital to the PDF files
- [ ] Add a Concise to the PDF files
- [ ] Add a Responsive to the PDF files
- [ ] Add a Min to the PDF files
- [ ] Add a Base to the PDF files
- [ ] Add a Normalize to the PDF files
- [ ] Add a Reset to the PDF files
- [ ] Add a Sanitize to the PDF files
- [ ] Add a Preflight to the PDF files
- [ ] Add a Reboot to the PDF files
- [ ] Add a Modern to the PDF files
- [ ] Add a Minireset to the PDF files
- [ ] Add a Ress to the PDF files
- [ ] Add a Remedy to the PDF files
- [ ] Add a A11y to the PDF files
- [ ] Add a Axe to the PDF files
- [ ] Add a Pa11y to the PDF files
- [ ] Add a Wave to the PDF files
- [ ] Add a Tota11y to the PDF files
- [ ] Add a Lighthouse to the PDF files
- [ ] Add a WCAG to the PDF files
- [ ] Add a ARIA to the PDF files
- [ ] Add a WAI to the PDF files
- [ ] Add a Section508 to the PDF files
- [ ] Add a EN301549 to the PDF files
- [ ] Add a ADA to the PDF files
- [ ] Add a AODA to the PDF files
- [ ] Add a EAA to the PDF files
- [ ] Add a BITV to the PDF files
- [ ] Add a RGAA to the PDF files
- [ ] Add a JIS to the PDF files
- [ ] Add a KWCAG to the PDF files
- [ ] Add a ATAG to the PDF files
- [ ] Add a UAAG to the PDF files
- [ ] Add a WCAG-EM to the PDF files
- [ ] Add a ACT to the PDF files
- [ ] Add a WAI-ARIA to the PDF files
- [ ] Add a WAI-ARIA-Practices to the PDF files
- [ ] Add a WAI-ARIA-Authoring to the PDF files
- [ ] Add a WAI-ARIA-Graphics to the PDF files
- [ ] Add a WAI-ARIA-APG to the PDF files
- [ ] Add a WAI-ARIA-Implementation to the PDF files
- [ ] Add a WAI-ARIA-Taxonomy to the PDF files
- [ ] Add a WAI-ARIA-Roles to the PDF files
- [ ] Add a WAI-ARIA-States to the PDF files
- [ ] Add a WAI-ARIA-Properties to the PDF files
- [ ] Add a WAI-ARIA-Relations to the PDF files
- [ ] Add a WAI-ARIA-Annotations to the PDF files
- [ ] Add a WAI-ARIA-Commands to the PDF files
- [ ] Add a WAI-ARIA-Live to the PDF files
- [ ] Add a WAI-ARIA-Landmarks to the PDF files
- [ ] Add a WAI-ARIA-DPub to the PDF files
- [ ] Add a WAI-ARIA-Graphics-AAM to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Module to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Roles to the PDF files
- [ ] Add a WAI-ARIA-Graphics-States to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Properties to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Relations to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Annotations to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Commands to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Live to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Landmarks to the PDF files
- [ ] Add a WAI-ARIA-Graphics-DPub to the PDF files
- [ ] Add a WAI-ARIA-Graphics-AAM to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Module to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Roles to the PDF files
- [ ] Add a WAI-ARIA-Graphics-States to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Properties to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Relations to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Annotations to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Commands to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Live to the PDF files
- [ ] Add a WAI-ARIA-Graphics-Landmarks to the PDF files
- [ ] Add a WAI-ARIA-Graphics-DPub to the PDF files

### Conclusion

I'm pretty happy with how this turned out. I'm able to write my assignments in Jupyter notebooks, and I'm able to keep them organized in GitHub. I'm also able to generate PDF files for my assignments, which is a requirement for my class. I'm also able to host my assignments on GitHub Pages, which makes it easy to share them with my professor and classmates.
