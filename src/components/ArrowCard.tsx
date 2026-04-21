import { formatDate, readingTime } from "@lib/utils"
import type { CollectionEntry } from "astro:content"

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">
  pill?: boolean
}

export default function ArrowCard({ entry, pill }: Props) {
  const estimatedReading =
    entry.collection === "blog"
      ? readingTime(entry.body).replace("min read", "мин")
      : null

  return (
    <a
      href={`/${entry.collection}/${entry.slug}`}
      class="group grid grid-cols-[90px_1fr_auto] md:grid-cols-[110px_1fr_auto] items-baseline gap-4 py-4 border-b border-black/10 dark:border-white/15 hover:border-accent transition-colors duration-200"
    >
      <div class="font-mono text-[11px] uppercase tracking-wider text-dim tabular-nums">
        {formatDate(entry.data.date)}
      </div>

      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          {pill && (
            <span class="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-black/15 dark:border-white/20 text-dim">
              {entry.collection === "blog" ? "post" : "project"}
            </span>
          )}
          <div class="font-sans text-[15px] md:text-[16px] font-semibold leading-snug text-black dark:text-white group-hover:text-accent transition-colors">
            {entry.data.title}
          </div>
        </div>
        <ul class="flex flex-wrap gap-x-2 gap-y-1 mt-2 font-mono text-[11px] text-accent">
          {entry.data.tags.map((tag: string) => (
            <li>#{tag}</li>
          ))}
        </ul>
      </div>

      {estimatedReading && (
        <div class="font-mono text-[11px] text-dim whitespace-nowrap">
          {estimatedReading}
        </div>
      )}
    </a>
  )
}
