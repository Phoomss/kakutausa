const { z } = require("zod");

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.union([
      z.number(),
      z.string().regex(/^\d+$/, "categoryId must be a valid number"),
    ]).transform(val => Number(val)),
    details: z.string().optional().nullable(),
    sizes: z.array(
      z.object({
        holdingCapacityMetric: z.string().optional().nullable(),
        weightMetric: z.string().optional().nullable(),
        handleMovesMetric: z.string().optional().nullable(),
        barMovesMetric: z.string().optional().nullable(),
        drawingMovementMetric: z.string().optional().nullable(),
        holdingCapacityInch: z.string().optional().nullable(),
        weightInch: z.string().optional().nullable(),
        handleMovesInch: z.string().optional().nullable(),
        barMovesInch: z.string().optional().nullable(),
        drawingMovementInch: z.string().optional().nullable(),
      })
    ).optional(),
  }),
});

module.exports = {
  createProductSchema,
};
