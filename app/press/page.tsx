import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import PressBoard from "../components/PressBoard";
import { listPressArticles } from "../../lib/db";

export const metadata: Metadata = {
  title: "보도자료 | 샤브광",
  description: "샤브광의 소식을 다양한 매체 보도자료로 만나보세요.",
};

export const dynamic = "force-dynamic";

export default async function PressPage() {
  const articles = await listPressArticles();

  return (
    <main>
      <Nav />

      <section className="section page-header">
        <div className="container">
          <Reveal>
            <p className="eyebrow">PRESS</p>
            <h1 className="section-title">보도자료</h1>
            <p className="section-subtitle">
              샤브광의 소식을 다양한 매체에서 만나보세요.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section news">
        <div className="container">
          <Reveal>
            <PressBoard articles={articles} />
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
