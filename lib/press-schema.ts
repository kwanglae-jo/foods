import { z } from "zod";

export const pressTypeSchema = z.enum(["press-release", "media-coverage", "brand-news"]);
export const pressStatusSchema = z.enum([
  "draft",
  "in_review",
  "scheduled",
  "published",
  "ended",
  "archived",
]);

const urlOrPath = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "URL(http/https) 또는 '/'로 시작하는 경로여야 합니다.",
  })
  .optional()
  .transform((v) => (v ? v : undefined));

export const tiptapDocSchema = z
  .object({ type: z.string() })
  .loose(); // Tiptap의 JSON 문서 구조를 그대로 저장한다(자유 스키마, 렌더링 시 확장 화이트리스트로 제한).

export const pressItemInputSchema = z
  .object({
    slug: z.string().trim().max(120).optional(),
    type: pressTypeSchema,
    status: pressStatusSchema,
    title: z.string().trim().min(1, "제목을 입력해주세요.").max(200),
    summary: z.string().trim().min(1, "한 줄 요약을 입력해주세요.").max(300),
    bodyJson: tiptapDocSchema,
    publishAt: z.string().datetime({ offset: true }).nullable().optional(),
    sourceName: z.string().trim().min(1, "매체명 또는 작성 주체를 입력해주세요.").max(100),
    sourceUrl: urlOrPath,
    thumbnailUrl: urlOrPath,
    heroImageUrl: urlOrPath,
    imageAlt: z.string().trim().max(200).optional(),
    attachmentUrl: urlOrPath,
    attachmentLabel: z.string().trim().max(100).optional(),
    author: z.string().trim().max(100).optional(),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string().trim().min(1).max(30)).max(10).optional().default([]),
    relatedIds: z.array(z.string().uuid()).max(6).optional().default([]),
    seoTitle: z.string().trim().max(70).optional(),
    seoDescription: z.string().trim().max(200).optional(),
    ogImageUrl: urlOrPath,
  })
  .superRefine((data, ctx) => {
    if (data.status === "scheduled" && !data.publishAt) {
      ctx.addIssue({
        code: "custom",
        path: ["publishAt"],
        message: "예약 발행 상태에서는 발행 시각을 입력해야 합니다.",
      });
    }
    if (data.status === "published" && !data.publishAt) {
      ctx.addIssue({
        code: "custom",
        path: ["publishAt"],
        message: "발행 상태에서는 발행 시각을 입력해야 합니다.",
      });
    }
  });

export type PressItemInput = z.infer<typeof pressItemInputSchema>;

export const uploadRequestSchema = z.object({
  folder: z.enum(["thumbnails", "hero", "body", "attachments"]),
});
