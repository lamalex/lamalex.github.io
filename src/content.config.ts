import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const recipeDetails = z.object({
  servings: z.string().optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  totalTime: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  steps: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  components: z
    .array(
      z.object({
        title: z.string(),
        ingredients: z.array(z.string()).optional(),
        equipment: z.array(z.string()).optional(),
        steps: z.array(z.string()).optional(),
        notes: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    recipe: recipeDetails.optional(),
  }),
});

const recipes = defineCollection({
  loader: glob({ base: "./src/content/recipes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    recipe: recipeDetails,
  }),
});

const cv = defineCollection({
  // Load Markdown files in the `src/content/cv/` directory
  loader: glob({ base: "./src/content/cv", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string().optional(),
    timespan: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { blog, recipes, cv };
