"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden />
      <motion.div
        className="hero__inner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="hero__title">
          샤브샤브에 공간을 더하다, <br className="hero__break" />
          샤브광
        </h1>
        <p className="hero__subtitle">
          품격 있는 미식 경험과 압도적인 공간 디자인이 만나는 곳. 프리미엄 샤브
          다이닝의 새로운 기준을 제시합니다.
        </p>
        <motion.a
          href="#menu"
          className="btn-outline"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
        >
          메뉴 보기
        </motion.a>
      </motion.div>
    </section>
  );
}
