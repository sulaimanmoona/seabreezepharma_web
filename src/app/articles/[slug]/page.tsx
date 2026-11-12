import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import Wave from "@/components/Wave";
import ArticleCard from "@/components/ArticleCard";
import { articles, formatThaiDate, getArticle } from "@/data/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="bg-ocean-gradient text-white">
        <div className="mx-auto max-w-3xl px-4 pb-6 pt-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white">
            <ArrowLeft size={16} /> กลับหน้าหลัก
          </Link>
          <span className="mt-5 block w-fit rounded-full bg-white/15 px-3 py-1 text-xs">
            {article.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-snug sm:text-4xl">{article.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <CalendarDays size={16} /> {formatThaiDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} /> อ่าน {article.readMinutes} นาที
            </span>
          </div>
        </div>
        <Wave className="text-sand" />
      </section>

      <article className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-lg leading-relaxed text-sea-800">{article.excerpt}</p>
        {article.sections.map((s, i) => (
          <section key={i} className="mt-8">
            {s.heading && (
              <h2 className="mb-3 border-l-4 border-mint pl-3 text-xl font-semibold text-sea-900">
                {s.heading}
              </h2>
            )}
            {s.paragraphs?.map((p, j) => (
              <p key={j} className="mb-3 leading-relaxed text-sea-950/85">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="space-y-2">
                {s.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-sea-950/85">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sea-500" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <div className="mt-10 rounded-2xl border border-sea-200 bg-sea-50 p-5 text-sm leading-relaxed text-sea-800">
          ข้อมูลนี้เป็นความรู้เบื้องต้น ไม่สามารถใช้แทนคำแนะนำจากแพทย์หรือเภสัชกรได้
          หากมีข้อสงสัย{" "}
          <Link href="/contact" className="font-medium text-ocean underline">
            ปรึกษาเภสัชกรของเรา
          </Link>
        </div>
      </article>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-xl font-bold">บทความอื่นที่น่าสนใจ</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
