import { Metadata } from "next";
import BranchesClient from "@/components/BranchesClient";

export const metadata: Metadata = {
  title: "आध्यात्मिक शाखाएं | राम नाम बैंक नज़दीकी केंद्र",
  description: "अपने शहर में श्री राम नाम महाधन संचय बैंक की शाखा खोजें और आध्यात्मिक संचय से जुड़ें।",
  keywords: ["Ram Nam Bank Branches", "Nearest Ram Nam Bank", "Ayodhya Bank Varanasi Branch", "Mathura Ram Nam Bank", "Spiritual Bank India Locations"],
};

export default function BranchesPage() {
  return <BranchesClient />;
}
