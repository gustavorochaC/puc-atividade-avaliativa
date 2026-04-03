export default function ProjectDetailsLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border/80 bg-card/85 p-6 shadow-sm">
        <div className="h-3 w-28 rounded-full bg-muted" />
        <div className="mt-4 h-9 w-64 rounded-full bg-muted" />
        <div className="mt-3 h-5 w-full max-w-3xl rounded-full bg-muted" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[28px] border border-border/80 bg-card/95 p-5 shadow-sm"
          >
            <div className="h-3 w-24 rounded-full bg-muted" />
            <div className="mt-4 h-10 w-20 rounded-full bg-muted" />
            <div className="mt-3 h-3 w-36 rounded-full bg-muted" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        <div className="rounded-[28px] border border-border/80 bg-card/95 p-6 shadow-sm">
          <div className="h-6 w-52 rounded-full bg-muted" />
          <div className="mt-3 h-4 w-72 rounded-full bg-muted" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-border/70 bg-background/80 p-5"
              >
                <div className="h-4 w-28 rounded-full bg-muted" />
                <div className="mt-4 h-5 w-56 rounded-full bg-muted" />
                <div className="mt-3 h-4 w-full rounded-full bg-muted" />
                <div className="mt-2 h-4 w-4/5 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-border/80 bg-card/95 p-6 shadow-sm"
            >
              <div className="h-6 w-40 rounded-full bg-muted" />
              <div className="mt-3 h-4 w-60 rounded-full bg-muted" />
              <div className="mt-6 space-y-3">
                <div className="h-20 rounded-[22px] bg-muted" />
                <div className="h-20 rounded-[22px] bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
