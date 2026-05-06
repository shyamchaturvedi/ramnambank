import { Metadata } from "next";
import MissionClient from "@/components/MissionClient";

export const metadata: Metadata = {
  title: "हमारा पावन संकल्प | विजन एवं मिशन",
  description: "विश्व के प्रत्येक भक्त के हृदय में राम नाम की ज्योति जलाना हमारा एकमात्र लक्ष्य है।",
  keywords: ["Ram Nam Bank Mission", "Spiritual Vision Ayodhya", "Sanatana Dharma Digital Move", "Ram Nam Sanchay Goals", "Ayodhya Spiritual Revolution"],
};

export default function MissionPage() {
  return <MissionClient />;
}
