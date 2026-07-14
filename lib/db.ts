import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  if (!_sql) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      "";
    _sql = neon(connectionString);
  }
  return _sql(strings, ...values);
}

export type PressArticle = {
  id: number;
  date: string;
  source: string;
  title: string;
  content: string;
};

const SEED_ARTICLES: Omit<PressArticle, "id">[] = [
  {
    date: "2026.07",
    source: "푸드투데이",
    title: "샤브광, 프리미엄 샤브 다이닝 새 기준 제시하며 가맹 확장",
    content:
      "1인 샤브샤브 전문 브랜드 샤브광이 프리미엄 다이닝 콘셉트를 앞세워 가맹 사업을 빠르게 확장하고 있다. 샤브광은 소형 매장 구조와 표준화된 육수 제조 공정을 바탕으로 안정적인 맛과 운영 효율을 동시에 구현했다는 평가를 받는다. 회사 관계자는 \"프리미엄 인테리어와 합리적인 창업 비용을 동시에 만족시키는 모델로 예비 창업자들의 문의가 꾸준히 늘고 있다\"고 밝혔다.",
  },
  {
    date: "2026.05",
    source: "창업경제신문",
    title: "1인 운영 가능한 소형 매장 모델로 주목받는 샤브광",
    content:
      "최근 외식 창업 시장에서 인건비 부담을 줄일 수 있는 1인 운영 매장에 대한 관심이 높아지는 가운데, 샤브광이 대표 사례로 꼽히고 있다. 조리 공정을 단순화하고 소형 평수에 맞춘 매장 설계를 적용해 초기 투자 비용과 인력 운영 부담을 동시에 낮췄다는 설명이다.",
  },
  {
    date: "2026.03",
    source: "외식산업뉴스",
    title: "샤브광, 지역 농가 상생 프로젝트로 신선육수팩 공급 확대",
    content:
      "샤브광이 지역 농가와의 협업을 통해 신선육수팩 공급망을 확대한다고 밝혔다. 이번 프로젝트는 지역 농산물 소비 촉진과 가맹점의 안정적인 원재료 수급을 동시에 달성하기 위해 마련됐으며, 향후 협업 지역을 순차적으로 넓혀갈 계획이다.",
  },
  {
    date: "2025.11",
    source: "프랜차이즈타임즈",
    title: "샤브광, 전국 가맹점 30호점 돌파 기념 인터뷰",
    content:
      "샤브광이 전국 가맹점 30호점을 돌파하며 성장세를 이어가고 있다. 본지와의 인터뷰에서 회사 관계자는 \"표준화된 매뉴얼과 지속적인 메뉴 개발로 가맹점과 함께 성장하는 것이 목표\"라며 향후 확장 계획을 밝혔다.",
  },
  {
    date: "2025.08",
    source: "매일창업",
    title: "낮은 초기 비용으로 시작하는 샤브샤브 창업, 샤브광이 답이다",
    content:
      "창업 비용 부담을 줄이면서도 검증된 메뉴로 안정적인 운영이 가능한 브랜드를 찾는 예비 창업자들 사이에서 샤브광이 꾸준히 언급되고 있다. 소형 매장 기반의 낮은 초기 투자와 체계적인 운영 교육이 강점으로 꼽힌다.",
  },
];

let schemaReadyPromise: Promise<void> | null = null;

async function ensureSchema() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS press_articles (
          id SERIAL PRIMARY KEY,
          date TEXT NOT NULL,
          source TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      const rows = (await sql`SELECT COUNT(*)::int AS count FROM press_articles`) as {
        count: number;
      }[];

      if (rows[0]?.count === 0) {
        for (const article of SEED_ARTICLES) {
          await sql`
            INSERT INTO press_articles (date, source, title, content)
            VALUES (${article.date}, ${article.source}, ${article.title}, ${article.content})
          `;
        }
      }
    })();
  }
  return schemaReadyPromise;
}

export async function listPressArticles(): Promise<PressArticle[]> {
  await ensureSchema();
  const rows = (await sql`
    SELECT id, date, source, title, content
    FROM press_articles
    ORDER BY date DESC, id DESC
  `) as PressArticle[];
  return rows;
}

export async function createPressArticle(
  data: Omit<PressArticle, "id">
): Promise<number> {
  await ensureSchema();
  const rows = (await sql`
    INSERT INTO press_articles (date, source, title, content)
    VALUES (${data.date}, ${data.source}, ${data.title}, ${data.content})
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updatePressArticle(
  id: number,
  data: Omit<PressArticle, "id">
): Promise<void> {
  await ensureSchema();
  await sql`
    UPDATE press_articles
    SET date = ${data.date}, source = ${data.source}, title = ${data.title}, content = ${data.content}
    WHERE id = ${id}
  `;
}

export async function deletePressArticle(id: number): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM press_articles WHERE id = ${id}`;
}
