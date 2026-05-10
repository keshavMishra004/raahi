"use client";
import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function CompanionsPage() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) api.setAuthToken(token);
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await api.get("/companions");
      setList(res.data || []);
    } catch (err) {
      try {
        const res = await api.rawGet("/companions", {
          headers: api.defaults.headers,
        });
        setList(res.data || []);
      } catch (e) {
        setList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () =>
    setEditing({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      nationality: "",
      aadharNumber: "",
      passportNumber: "",
      age: "",
      height: { value: "", unit: "cm" },
      weight: { value: "", unit: "kg" },
    });

  const save = async () => {
    try {
      if (editing._id) await api.put(`/companions/${editing._id}`, editing);
      else await api.post("/companions", editing);
      setEditing(null);
      fetchList();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/companions/${id}`);
      fetchList();
    } catch (err) {
      console.error(err);
      fetchList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-sky-600">My Companions</h2>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600 text-white shadow"
        >
          Add +
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="flex gap-2 flex-wrap mb-4">
          {list.map((c) => (
            <div
              key={c._id}
              className="px-3 py-1 rounded-full border text-sm text-slate-700"
            >
              {c.firstName} {c.lastName}
            </div>
          ))}
          {!list.length && (
            <div className="text-sm text-slate-500">No companions yet</div>
          )}
        </div>

        <div>
          {editing ? (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold mb-4">Companion Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* inputs */}
                <div className="space-y-2">
                  <label className="text-sm text-slate-600">First Name</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editing.firstName}
                    onChange={(e) =>
                      setEditing({ ...editing, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Middle Name</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editing.middleName}
                    onChange={(e) =>
                      setEditing({ ...editing, middleName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Last Name</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editing.lastName}
                    onChange={(e) =>
                      setEditing({ ...editing, lastName: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-slate-600">Email</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editing.email}
                    onChange={(e) =>
                      setEditing({ ...editing, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Nationality</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editing.nationality}
                    onChange={(e) =>
                      setEditing({ ...editing, nationality: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Aadhar</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editing.aadharNumber}
                    onChange={(e) =>
                      setEditing({ ...editing, aadharNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Passport</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editing.passportNumber}
                    onChange={(e) =>
                      setEditing({ ...editing, passportNumber: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Age</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editing.age}
                    onChange={(e) => setEditing({ ...editing, age: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Height</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border rounded px-3 py-2"
                      value={editing.height?.value || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          height: { ...(editing.height || {}), value: e.target.value },
                        })
                      }
                    />
                    <select
                      className="w-28 border rounded px-3 py-2"
                      value={editing.height?.unit || "cm"}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          height: { ...(editing.height || {}), unit: e.target.value },
                        })
                      }
                    >
                      <option value="cm">cm</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Weight</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border rounded px-3 py-2"
                      value={editing.weight?.value || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          weight: { ...(editing.weight || {}), value: e.target.value },
                        })
                      }
                    />
                    <select
                      className="w-28 border rounded px-3 py-2"
                      value={editing.weight?.unit || "kg"}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          weight: { ...(editing.weight || {}), unit: e.target.value },
                        })
                      }
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={save}
                  className="px-4 py-2 rounded-full bg-cyan-600 text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-full border"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="text-sm text-slate-500">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {list.map((c) => (
                    <div
                      key={c._id}
                      className="flex items-center justify-between border-b py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                          {(c.firstName || "")[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {c.firstName} {c.lastName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {c.email || "—"} • {c.nationality || "—"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(c)}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(c._id)}
                          className="px-3 py-1 border rounded text-sm text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
