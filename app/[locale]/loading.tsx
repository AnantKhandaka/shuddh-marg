export default function HomeLoading() {
  return (
    <main className="bg-orange-50">
      <section className="bg-orange-200 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto h-10 w-3/4 animate-pulse rounded bg-orange-300" />
          <div className="mx-auto mt-4 h-5 w-2/3 animate-pulse rounded bg-orange-300" />
          <div className="mx-auto mt-8 h-11 w-full max-w-2xl animate-pulse rounded bg-white/70" />
        </div>
      </section>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      </section>
    </main>
  )
}
