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
        <motion.span
          className="badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          샤브광 가맹점 모집
        </motion.span>
        <h1 className="hero__title">샤브샤브에 공간을 더하다</h1>
        <p className="hero__subtitle">
          빠르게 먹고 나가는 식사가 아닌, 나를 위한 여유로운 한 끼 — 1인샤브샤브
          전문 브랜드 샤브광과 함께하세요
        </p>
        <motion.a
          href="#inquiry"
          className="btn-primary"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
        >
          가맹 상담 문의하기
        </motion.a>
      </motion.div>
    </section>
  );
}
