+++
title = "Commissioning this weblog 🍾"
date = 2020-08-30
tags = ["ssg", "Zola", "rust", "grad school", "travis", "svg"]
+++

## Hooray! 🙌🏻

Today I built this personal site. This is a task I've been putting off for a **long. time.**

The first assignment for my _Data Science and Analytics_ class is to build a personal website with a short bio and a professional photograph (Coming, I swear), but I built this instead.

### Static Site Generator

I knew that I wanted to use a static site generator. The requirements of the assignment included hosting your simple site on the university server, or via GitHub pages (`spoiler alert: I went with github`).

I've used static generators prior; my [cv](https://lamamlex.github.io/cv) is hosted on github using [Jekyll](https://jekyllrb.com). I've got nothing bad to say about jekyll. It works great for my CV, and if Zola wasn't written in [Rust 🦀](https://www.rust-lang.org) I probably would have, but wow-- Zola is **fast**. Very fast. `Zola build` on this site takes 20ms, whereas Jekyll on my CV takes 392ms. This isn't a dig on Jekyll, I'm not complaining about waiting 392ms, but Zola is almost imperceptibly fast.

### SVG

Knowing I was going to build this site, I spent $9.99 on a udemy course to learn a little bit about svg. I'd seen the amazing things that [some](Cassie.codes) [people](https://joshwcomeau.com) make with SVG and while I will probably never do that I wanted to have some fun with this. 

The udemy course was an absolute waste of $9.99. I won't link to it as to not slander the creator, I'm sure some people found it very useful. It was highly rated, but it wasn't at the level I wanted.

<svg height="175" style="stroke: var(--color-dark); fill:none; stroke-width:2;">
            <circle
                cx="100"
                cy="100"
                r="50"
            />
            <ellipse
                rx="7"
                ry="12"
                cx="85"
                cy="80"
            />
            <ellipse
                rx="7"
                ry="12"
                cx="115"
                cy="80"
            />
            <path
                d="M80,85 A10,30 0 0,1 90,85 A10,38 0 0,1 80,85"
                style="fill:black;"
            />
            <path
                d="M110,85 A10,30 0 0,1 120,85 A10,38 0 0,1 110,85"
                style="fill:black;"
            />
            <path 
                d="M100,100 L95,110 A7,10 0 0,0 105,110 L100,100"
                style="fill:black;"
            />
            <path
                d="M085,122 A20,20 0 0,0 115,122"
            />
            <path
                d="M92,127 A10,10 0 0,1 107,128"
                style="fill:var(--color-rose);"
            />
            <path
                d="M55,75 A20,40 0 0,1 95,50 M105,50 A20,40 0 0,1 145,75"
            />
        </svg>

We made this cute 'lil face (modified to work with dark mode)! And it's fine, but it wasn't what I was looking for. That was a bust, but it did give me some basic knowledge and understanding of how SVG works that I leveraged for the silhouette illustration of the reaper.

### Travis-CI

Since I use [Travis](https://www.travis-ci.com) for my other projects' build pipelines it made sense enough to use it again. The Zola documentation has a tutorial for setting up a continuous deployment build with Travis, but I wasn't having success with just following the tutorial. I've used Travis enough that I decided just to "do the work myself" and came up with this `.travis.yml`

```yaml
language: minimal

before_script:
  # Download and unzip the zola executable
  - curl -s -L https://github.com/getzola/zola/releases/download/v0.11.0/zola-v0.11.0-x86_64-unknown-linux-gnu.tar.gz | sudo tar xvzf - -C /usr/local/bin

script:
  - zola build

deploy:
  provider: pages
  skip-cleanup: true
  local_dir: public
  github_token: $GH_TOKEN
  on:
    branch: master
```



### Light mode/Dark mode --> Party mode/cold-reality-mode mode

Admittedly all of the hard work of designing a color scheme was done for me. I ape'd a significant amount of the markup for this site from [cassie.codes](https://cassie.codes), but I implemented my own simple mode switcher from *party mode* to *cold-dark-reality-mode*.

```javascript
function() {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

    function switchTheme(e) {
        document.body.classList.toggle('party')
        document.body.classList.toggle('death')
        localStorage.setItem('theme', document.body.classList.contains('party') ? 'party' : 'death'); //add this
    }

    toggleSwitch.addEventListener('change', switchTheme, false);

    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.body.className = ''
        document.body.classList.add(currentTheme)
        toggleSwitch.checked = currentTheme === 'death'

        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
}
```



Now to take that professional photo...