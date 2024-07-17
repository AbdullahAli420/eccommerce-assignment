import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { env } from "~/env";

export const categorieRouter = createTRPCRouter({
  generateCategories: publicProcedure.mutation(async function ({ ctx }) {
    const categories = [];
    // Generate 10 categories
    for (let i = 0; i < 100; i++) {
      categories.push({
        name: faker.commerce.department(),
      });
    }
    // Save categories to database
    return await ctx.db.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
  }),
  getCategories: publicProcedure
    .input(
      z.object({ page: z.number(), token: z.string(), user_id: z.number() }),
    )
    .use(async ({ next, input }) => {
      const { token } = input;
      if (!token) throw new Error("login");
      const decoded = jwt.verify(token, env.JWT_SECRET_KEY);
      if (!decoded) throw new Error("login");
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const { page, user_id } = input;
      const categories = await ctx.db.category.findMany({
        skip: page * 6,
        take: 6,
      });
      const count = await ctx.db.category.count();
      console.log(categories);
      const checkedCategories = new Set();
      const categorieId = await ctx.db.checkedCategory.findMany({
        where: { userId: user_id },
        select: { categoryId: true },
      });
      categorieId.forEach((category) =>
        checkedCategories.add(category.categoryId),
      );
      return {
        pages: Math.floor(count / 6),
        categories: categories,
        checkedCategories: checkedCategories,
      };
    }),
  checkCategory: publicProcedure
    .input(
      z.object({
        category_id: z.number(),
        token: z.string(),
        user_id: z.number(),
        check: z.boolean(),
      }),
    )
    .use(async ({ next, input }) => {
      const { token } = input;
      if (!token) throw new Error("login");
      const decoded = jwt.verify(token, env.JWT_SECRET_KEY);
      if (!decoded) throw new Error("login");
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const { category_id, check, user_id } = input;
      const category = await ctx.db.category.findUnique({
        where: { id: category_id },
      });
      const user = await ctx.db.user.findUnique({ where: { id: user_id } });
      if (!user) throw new Error("User not found");
      if (!category) throw new Error("Category not found");
      if (category && user && !check)
        await ctx.db.checkedCategory.create({
          data: { userId: user_id, categoryId: category_id },
        });
      else
        await ctx.db.checkedCategory.delete({
          where: {
            userId_categoryId: {
              userId: user_id,
              categoryId: category_id,
            },
          },
        });
      const checkedCategories = new Set();
      const categorieId = await ctx.db.checkedCategory.findMany({
        where: { userId: user_id },
        select: { categoryId: true },
      });
      categorieId.forEach((category) =>
        checkedCategories.add(category.categoryId),
      );
      return { checkedCategories: checkedCategories };
    }),
});
