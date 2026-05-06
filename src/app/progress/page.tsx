import { Metadata } from "next";
import ProgressClient from "@/components/ProgressClient";

export const metadata: Metadata = {
  title: "वैश्विक आध्यात्मिक प्रगति | राम नाम लाइव काउंटर",
  description: "विश्व भर में संचित हो रहे राम नाम के लाइव आँकड़े और आध्यात्मिक प्रगति रिपोर्ट देखें।",
  keywords: ["Global Ram Nam Progress", "Spiritual Growth Chart", "Ayodhya Ram Nam Counter", "Digital Sanchay Reports", "Ram Nam Bank Live Data"],
};

export default function GlobalProgressPage() {
  return <ProgressClient />;
}
