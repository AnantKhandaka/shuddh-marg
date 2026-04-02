export default function CompaniesLoading() {
  return (
    <main className="bg-orange-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-200" />
          ))}
        </div>
      </div>
    </main>
  )
}
