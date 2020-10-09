+++
title = "Auto-generating my pdf resume with Travis CI"
date = 2020-09-12
tags = ["Travis", "career", "SSG"]
draft = false
+++

My cv is written to be both web and printer friendly, but the styling for print, 
and the styling for web are not the same. Styling for print and screen can easily
be handled via css media queries:
```css
h1 {
    color: mediumaquamarine;
}
@media print {
    h1 {
        color: teal;
    }
}
```
Now you have a different color \<h1\> element styles for when your page is printed or rendered on the web!
You can use css media queries for lots of things, but that's beyond the intended scope of this post.
<br />
<br />
As much as I'd love employers to use my personal site and hosted CV as their reference the reality
is that HR and recruiters will want a PDF, or paper copy. I keep this linked off of my home page,
but early on I ran into a problem of the PDF getting out of sync with the web version. Having a manual
step to print a pdf from local development, updating a static pdf file, and then pushing to git was
cumbersome and error prone, fortunately it was fully automatable.

## So here's what I do!
This site is built as a static site using [Zola](www.getzola.org), and then deployed to [GitHub pages](https://pages.github.com)
via [Travis CI](https://travis-ci.com/). Deploying a static site with Zola is straight forward and 
[documented](https://www.getzola.org/documentation/deployment/github-pages/#travis-ci).

#### Generating a print pdf automatically
At some time in the past Chrome added a headless mode for testing purposes. It brings all of the web features, and rendering engine
provided by Chromium to environments which might not have a display (like a continuous integration server!). We can exploit this to
script our way to a printed pdf.
```bash
$ chromium-browser --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf=<output> <url endpoint>
```
Super! So we just need to update `<output>` to the directory where we serve static content from, but what is our url endpoint?
We could use the url of our live site, but that has some drawbacks.
  * Our PDF would be out of date.
    * Maybe we could fix this by having a two pass build?<br />Every push has one push which updates the site, and then a second pass to update the pdf?<br />
     It would work, but it's definitely wasteful. 2 full builds of your site on every push? No thank you. We can do better.
How about we spin up a development server inside of our build, and hit that local endpoint. `zola serve` to the rescue.
```bash
$ zola serve > /dev/null 2>&1 & # we send stdout and stderr to null to keep our CI logs clean
$ export ZOLA_PID=$! # Save the newly spawned PID so we can kill Zola after we get our pdf
$ chromium-browser --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header \
    --print-to-pdf=static/alexlauni-resume.pdf http://127.0.0.1:1111/cv/ # Oh, word?
$ kill $ZOLA_PID # end Zola so we can build and publish
```
🥚-cellent. What does this look like in our Travis config, `.travis.yml`?
```yaml
script:
  - zola serve > /dev/null 2>&1 &
  - export ZOLA_PID=$!
  - chromium-browser --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf=static/alexlauni-resume.pdf http://127.0.0.1:1111/cv/
  - kill $ZOLA_PID
  - zola build
```
Why are we using chromium-browser and not google chrome? I don't have a good answer for why, but when I was setting this build pipeline up
I ran into an error on Travis.
```bash
$ google-chrome-stable --headless
164/usr/bin/google-chrome-stable: error while loading shared libraries: libatk-bridge-2.0.so.0: cannot open shared object file: No such file or directory
165The command "google-chrome-stable --headless" exited with 127.
```
Using chromium with some additional installed dependencies fixed the issue. When all is said and done, my `.travis.yml` looks like this:
```yaml
language: shell

addons:
  apt:
    update: true

before_install:
  - sudo apt-get -y install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils chromium-browser
  
before_script:
  - curl -s -L https://github.com/getzola/zola/releases/download/v0.12.2/zola-v0.12.2-x86_64-unknown-linux-gnu.tar.gz | sudo tar xvzf - -C /usr/local/bin

script:
  - zola serve > /dev/null 2>&1 &
  - export ZOLA_PID=$!
  - chromium-browser --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf=static/alexlauni-resume.pdf http://127.0.0.1:1111/cv/
  - kill $ZOLA_PID
  - zola build

deploy:
  provider: pages
  skip_cleanup: true
  local_dir: public
  token: $GH_TOKEN
  on:
    branch: main 
```

And now you have a static site with an automatically updated pdf copy of your resume. Good luck in your job search!
