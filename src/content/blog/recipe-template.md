---
title: "Recipe Template: Midnight Pantry Pasta"
description: "A reference post that shows how to structure and style recipes in this retro blog layout."
pubDate: 2026-03-19
updatedDate: 2026-03-19
recipe:
  servings: "Feeds 2 hungry humans"
  prepTime: "10 minutes"
  cookTime: "15 minutes"
  totalTime: "25 minutes"
  tags:
    - weeknight
    - pantry magic
    - vegetarian-ish
  ingredients:
    - 8 oz dried spaghetti (ramen bricks work in a pinch)
    - 3 cloves garlic, sliced thin
    - 1 tsp crushed red pepper
    - 3 tbsp olive oil
    - 2 tbsp tomato paste
    - 1 cup starchy pasta water
    - 1 tbsp butter (optional but recommended)
    - 1 oz parmesan or any salty cheese, grated
    - Handful of arugula or frozen peas for color
    - Salt + black pepper to taste
  steps:
    - Bring a medium pot of heavily salted water to a boil and drop in the pasta; cook it 1 minute shy of the package time.
    - While the pasta cooks, warm olive oil in a skillet over medium heat, then add garlic and red pepper until the garlic just turns golden.
    - Squeeze in the tomato paste and let it fry until brick red; splash with pasta water to form a glossy sauce.
    - Toss the undercooked pasta right into the skillet along with butter and greens, then add more pasta water until everything is coated.
    - Kill the heat, shower with cheese, and stir like you mean it until the sauce clings to every strand.
  equipment:
    - Medium sauce pot
    - Wide skillet or sauté pan
    - Microplane or box grater
  notes:
    - Finish with lemon zest or chili crisp for bonus energy.
    - Swap in canned chickpeas, tuna, or leftover chicken to make it heartier.
  components:
    - title: "Garlic Crunch"
      ingredients:
        - 2 tbsp panko breadcrumbs
        - 1 tbsp olive oil
        - 1 garlic clove, grated
      equipment:
        - Small skillet
      steps:
        - Toast the breadcrumbs with garlic and oil until tan and crisp.
    - title: "Assembly"
      equipment:
        - Tongs for tossing
      steps:
        - Pile pasta into bowls, shower with garlic crunch, and serve hot.
---

## Why this exists

I wanted a repeatable way to drop a recipe into the blog without fighting the retro layout every time. The frontmatter above drives the "Recipe Capsule" card—fill in what you have, skip the rest.

## Markdown template

Copy this block into a new post and edit the values inline. Arrays (`ingredients`, `steps`, `equipment`, `notes`, `tags`) are plain bullet lists in YAML, so if you can write a grocery list you can feed the template.

```yaml
recipe:
  servings: "Feeds 2 hungry humans"
  prepTime: "10 minutes"
  cookTime: "15 minutes"
  totalTime: "25 minutes"
  tags:
    - weeknight
    - pantry magic
  ingredients:
    - Ingredient one
    - Ingredient two
  steps:
    - First step
    - Second step
  equipment:
    - Gear item
  notes:
    - Optional note or swap
  components:
    - title: "Sauce"
      ingredients:
        - Sub-list ingredient
      equipment:
        - Sub gear item
      steps:
        - Sub-list step
    - title: "Assembly"
      equipment:
        - Serving platter
      steps:
        - Wrap up the dish
```

Everything else in the markdown body works the same way as any other post, so you can wrap the recipe with origin stories, hosting notes, or embedded gadgets.

## Multi-part builds

Use the `components` array when a dish has multiple sub-recipes (sauces, garnishes, doughs, etc.). Each component renders with its own headline, ingredient list, steps, and optional notes so you can keep mise en place tidy and readable without cramming everything into one mega list.
Add `equipment` inside individual components if each part needs its own tools.

## Writing tips

- Keep steps written as actions so the ordered list reads like a checklist.
- Ingredients render as-is, so add measurements right inside the string.
- Use the optional notes section for substitutions or storage tips.
- Tags show up as little chips for quick scanning on mobile.

Happy cooking—and yes, you should absolutely add extra cheese.
