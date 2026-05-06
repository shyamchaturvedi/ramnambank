import { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "हमारे बारे में | संस्थान का इतिहास एवं विजन",
  description: "श्री जगन्नाथ ओडियाबाबा सेवा संस्थान और राम नाम बैंक की पावन यात्रा के बारे में विस्तार से जानें।",
  keywords: ["About Ram Nam Bank", "Shri Jagannath OdiaBaba History", "Ayodhya Spiritual Bank Story", "Ram Nam Sanchay Sansthan", "Ayodhya Dham Legacy"],
};

export default function AboutPage() {
  return <AboutClient />;
}
