import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "श्री राम नाम महाधन संचय बैंक | अयोध्या धाम (Official Site)",
  description: "विश्व का सबसे अनूठा आध्यात्मिक कोष - अयोध्या धाम से संचालित। प्रभु श्री राम के पावन नाम को अपनी शाश्वत पूंजी बनाएं।",
  keywords: ["Ram Nam Bank Ayodhya", "Best Spiritual Bank", "Ayodhya Ram Mandir Bank", "Ram Nam Sanchay Online", "Digital Spiritual Banking", "Shri Jagannath OdiaBaba Ayodhya"],
};

export default function PublicHome() {
  return <HomeClient />;
}
