"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Send } from "lucide-react";

// WhatsApp Icon Component
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

interface SocialShareButtonsProps {
  text: string;
}

export function SocialShareButtons({ text }: SocialShareButtonsProps) {
  const handleShare = (
    platform: "twitter" | "facebook" | "whatsapp" | "linkedin" | "telegram"
  ) => {
    const url = encodeURIComponent(window.location.href);
    const encodedText = encodeURIComponent(text);
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(
          "Twibbon Milad Ke-16 UKM PTQ"
        )}&summary=${encodedText}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${encodedText}`;
        break;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("whatsapp")}
      >
        <WhatsAppIcon className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("twitter")}
      >
        <Twitter className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("facebook")}
      >
        <Facebook className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("linkedin")}
      >
        <Linkedin className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => handleShare("telegram")}>
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
