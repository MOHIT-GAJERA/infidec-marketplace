import { PageHeader } from "./PageHeader";

export type Block = { heading: string; body: string[]; list?: string[] };

type Props = { path: string; label: string; title: string; description: string; blocks: Block[]; updated?: string };

/** Shared layout for policy / help / info pages. */
export function ContentPage({ path, label, title, description, blocks, updated }: Props) {
  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: path, label },
        ]}
        title={title}
        description={description}
      />
      <article className="container-x py-12 lg:py-16">
        <div className="prose-legal max-w-3xl">
          {updated && <p className="text-sm text-muted">Last updated: {updated}</p>}
          {blocks.map((b) => (
            <section key={b.heading}>
              <h2>{b.heading}</h2>
              {b.body.map((p) => (
                <p key={p.slice(0, 32)} className="mt-3">
                  {p}
                </p>
              ))}
              {b.list && (
                <ul>
                  {b.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
