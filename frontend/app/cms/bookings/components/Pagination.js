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
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
      {createRange().map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 border rounded ${p === page ? "bg-blue-600 text-white" : ""}`}>{p}</button>
      ))}
      <button disabled={page >= pages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>
  );
}
