"use client";
export default function Pagination({ page = 1, total = 0, limit = 5, onPageChange }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const createRange = () => {
    const arr = [];
    for (let i = 1; i <= pages; i++) arr.push(i);
    return arr;
  };

  return (
    <div className="flex items-center gap-2">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-2 h-10 border border-neutral-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-50 transition-colors text-sm font-medium flex items-center justify-center whitespace-nowrap">Previous</button>
      {createRange().map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-2 h-10 border rounded-lg text-sm font-medium flex items-center justify-center whitespace-nowrap transition-all ${p === page ? "bg-sky-600 text-white border-sky-600" : "border-neutral-300 text-neutral-700 hover:bg-sky-50"}`}>{p}</button>
      ))}
      <button disabled={page >= pages} onClick={() => onPageChange(page + 1)} className="px-3 py-2 h-10 border border-neutral-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-50 transition-colors text-sm font-medium flex items-center justify-center whitespace-nowrap">Next</button>
    </div>
  );
}
