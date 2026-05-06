import { Metadata } from "next";
import DonateClient from "@/components/DonateClient";

export const metadata: Metadata = {
  title: "दान एवं सेवा | श्री राम नाम महाधन संचय बैंक",
  description: "प्रभु श्री राम के कार्यों में अपना सहयोग दें। राम नाम पुस्तिका छपाई और संतों की सेवा के लिए दान करें।",
  keywords: ["Donate for Ram Nam Bank", "Ayodhya Charity", "Ram Mandir Donation", "Tax Benefit Donation Ayodhya", "Shri Jagannath Sewa Sansthan Donate"],
};

export default function DonationPage() {
  return <DonateClient />;
}
