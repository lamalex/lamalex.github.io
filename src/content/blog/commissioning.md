---
title: "Commissioning this weblog 🍾"
description: "Building a personal site with Zola, a blazing fast static site generator written in Rust"
pubDate: 2020-08-30
tags: ["ssg", "Zola", "rust", "grad school", "travis", "svg"]
---

## Hooray! 🙌🏻

Today I built this personal site. This is a task I've been putting off for a **long. time.**

The first assignment for my _Data Science and Analytics_ class is to build a personal website with a short bio and a professional photograph, but I built this instead.

### Static Site Generator

I knew that I wanted to use a static site generator. The requirements of the assignment included hosting your simple site on the university server, or via GitHub pages (`spoiler alert: I went with github`).

I've used static generators prior; my [cv](/cv) is hosted on github using [Jekyll](https://jekyllrb.com). I've got nothing bad to say about jekyll. It works great for my CV, and if Zola wasn't written in [Rust 🦀](https://www.rust-lang.org) I probably would have, but wow-- Zola is **fast**. Very fast. `Zola build` on this site takes 20ms, whereas Jekyll on my CV takes 392ms. This isn't a dig on Jekyll, I'm not complaining about waiting 392ms, but Zola is almost imperceptibly fast.

#### *update 9/11/2020*
I have ported my [CV](/cv) over to be part of this site! Zola with blog posts, my landing page, and my cv builds in 83ms, over 4x faster than Jekyll.

### SVG
Knowing I was going to build this site, I spent $9.99 on a udemy course to learn a little bit about svg. I'd seen the amazing things that [some](Cassie.codes) [people](https://joshwcomeau.com) make with SVG and while I will probably never do that I wanted to have some fun with this. 

The udemy course was an absolute waste of $9.99. I won't link to it as to not slander the creator, I'm sure some people found it very useful. It was highly rated, but it wasn't at the level I wanted.

<svg height="175" style="stroke: currentColor; fill:none; stroke-width:2;">
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
        d="M70,120 A30,30 0 0,0 130,120"
        style="fill:none;"
    />
</svg>

I did learn enough to make this little face though. I'm pretty proud of it. It's not much but I made it myself. It's not even really SVG, it's just using SVG to draw shapes. The real power of SVG is in its ability to be animated and to be responsive. I'll get there eventually.

### Travis CI
I'm using [Travis CI](https://travis-ci.org) to build and deploy this site. It's free for open source projects and it's really easy to set up. I'm using it to build and deploy my CV as well. I'm not doing anything fancy with it, just building and deploying to GitHub pages. I'm using the `travis-ci.com` domain instead of `travis-ci.org` because that's what they're moving to. I'm not sure if there's any difference between the two, but I figured I'd use the new one since that's what they're moving to.

### Conclusion
I'm pretty happy with how this turned out. I'm not sure if I'll keep using Zola or if I'll switch to something else, but I'm happy with it for now. I'm also not sure if I'll keep using Travis CI or if I'll switch to GitHub Actions, but I'm happy with it for now. I'm also not sure if I'll keep using GitHub pages or if I'll switch to something else, but I'm happy with it for now. I'm also not sure if I'll keep using this theme or if I'll switch to something else, but I'm happy with it for now. I'm also not sure if I'll keep using this domain or if I'll switch to something else, but I'm happy with it for now. I'm also not sure if I'll keep using this blog or if I'll switch to something else, but I'm happy with it for now.
