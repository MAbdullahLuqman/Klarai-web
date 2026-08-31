"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ServiceLeadForm({ service = "Service enquiry" }) {
  const [form, setForm] = useState({ name: "", email: "", website: "", problem: "", company: "" });
  const [status, setStatus] = useState("idle");
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) return;
    if (form.company) return setStatus("sent");
    setStatus("saving");

    try {
      await addDoc(collection(db, "leads"), {
        source: "service_page",
        service,
        name: form.name.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        problem: form.problem.trim(),
        capturedAt: serverTimestamp(),
      });
      setStatus("sent");
      setForm({ name: "", email: "", website: "", problem: "", company: "" });
    } catch (error) {
      console.error("Service lead form failed:", error);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-[1.1rem] border border-white/12 bg-white/8 p-6 text-left">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e0b48b]">Sent</p>
        <h3 className="mt-3 text-2xl font-black tracking-tight">We will reply within one working day.</h3>
      </div>
    );
  }

  const inputClass = "h-14 rounded-md border border-white/12 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-white/45 focus:border-[#e0b48b]";

  return (
    <form onSubmit={submit} className="self-start rounded-[1.1rem] border border-white/10 bg-white/[0.04] p-4 text-left sm:grid sm:grid-cols-2 sm:gap-3 sm:p-5">
      <input tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => update("company", event.target.value)} className="hidden" />
      <input required autoComplete="name" placeholder="Name" value={form.name} onChange={(event) => update("name", event.target.value)} className={inputClass} />
      <input required type="email" autoComplete="email" placeholder="Work email" value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} />
      <input type="url" inputMode="url" placeholder="Website" value={form.website} onChange={(event) => update("website", event.target.value)} className={inputClass} />
      <textarea placeholder="Main problem" value={form.problem} onChange={(event) => update("problem", event.target.value)} rows={3} className={`${inputClass} h-28 resize-none py-4 sm:row-span-2`} />
      <button disabled={status === "saving"} className="mt-3 h-14 rounded-md bg-[#ad5b2b] px-6 text-sm font-black text-white transition hover:bg-[#8d4822] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1 sm:mt-0">
        {status === "saving" ? "Sending..." : "Send details"}
      </button>
      {status === "error" && <p className="text-sm font-bold text-red-200 sm:col-span-2">Could not send this. Email abdullah@klarai.uk instead.</p>}
    </form>
  );
}
