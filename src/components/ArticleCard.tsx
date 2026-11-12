import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Article } from "@/data/articles";

const accents = [
  "from-ocean to-sea-500",
  "from-sea-600 to-mint",
  "from-sea-500 to-ocean-light",
];

export default function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sea-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sea-200/60"
    >
      <div className={`h-2 bg-linear-to-r ${accents[index % accents.length]}`} />
      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-sea-50 px-3 py-1 text-xs font-medium text-sea-700">
          {article.category}
        </span>
        <h3 className="mt-3 text-lg font-semibold leading-snug text-sea-950 group-hover:text-ocean">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-sea-800/80">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-sea-600">
            <Clock size={15} /> อ่าน {article.readMinutes} นาที
          </span>
          <span className="flex items-center gap-1 font-medium text-ocean">
            อ่านต่อ <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
