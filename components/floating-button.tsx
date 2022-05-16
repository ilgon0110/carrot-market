import Link from "next/link";
import React from "react";

interface FloatingButtonProps {
  children: React.ReactNode;
  href: string;
}

export default function FloatingButton({
  children,
  href,
}: FloatingButtonProps) {
  return (
    <Link href={href} passHref>
      <div className="sticky flex justify-end max-w-xl bottom-32 border-0 border-transparent">
        <a className="w-14 h-14 rounded-full hover:bg-orange-500 transition-colors cursor-pointer shadow-xl bg-orange-400 flex items-center justify-center text-white">
          {children}
        </a>
      </div>
    </Link>
  );
}
