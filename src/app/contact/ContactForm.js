"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const goals = [
  "More leads from Google",
  "Fix technical SEO",
  "Show up in AI answers",
  "Build or improve my website",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    goal: goals[0],
    message: "",
    company: "",
  });
  const [status, setStatus] = useState("idle");

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.company) return setStatus("sent");
    setStatus("saving");

    try {
      await addDoc(collection(db, "leads"), {
        source: "contact_page",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        website: form.website.trim(),
        goal: form.goal,
        message: form.message.trim(),
        capturedAt: serverTimestamp(),
      });
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", website: "", goal: goals[0], message: "", company: "" });
    } catch (error) {
      console.error("Contact form failed:", error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.1rem] border border-black/8 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:p-7">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ad5b2b]">Quick enquiry</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2f3438]">Tell us what you want fixed.</h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-black/48">Most people finish this in under a minute.</p>
      </div>

      <input tabIndex="-1" autoComplete="off" value={form.company} onChange={(event) => update("company", event.target.value)} className="hidden" />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Name</span>
          <input required value={form.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" className="mt-2 min-h-13 w-full rounded-md border border-black/10 bg-[#f9f5ec] px-4 text-sm font-bold outline-none focus:border-[#ad5b2b]" />
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Email</span>
          <input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" className="mt-2 min-h-13 w-full rounded-md border border-black/10 bg-[#f9f5ec] px-4 text-sm font-bold outline-none focus:border-[#ad5b2b]" />
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Website</span>
          <input value={form.website} onChange={(event) => update("website", event.target.value)} placeholder="example.co.uk" autoComplete="url" className="mt-2 min-h-13 w-full rounded-md border border-black/10 bg-[#f9f5ec] px-4 text-sm font-bold outline-none placeholder:text-black/28 focus:border-[#ad5b2b]" />
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Phone optional</span>
          <input type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" className="mt-2 min-h-13 w-full rounded-md border border-black/10 bg-[#f9f5ec] px-4 text-sm font-bold outline-none focus:border-[#ad5b2b]" />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Main goal</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {goals.map((goal) => (
            <label key={goal} className={`cursor-pointer rounded-md border px-4 py-3 text-sm font-black transition ${form.goal === goal ? "border-[#ad5b2b] bg-[#ad5b2b] text-white" : "border-black/10 bg-[#f9f5ec] text-[#2f3438]/64 hover:text-[#2f3438]"}`}>
              <input type="radio" name="goal" value={goal} checked={form.goal === goal} onChange={(event) => update("goal", event.target.value)} className="sr-only" />
              {goal}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Anything useful optional</span>
        <textarea value={form.message} onChange={(event) => update("message", event.target.value)} rows="4" placeholder="Example: We rank on page 2, leads dropped, or we need a new service page." className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f5ec] px-4 py-3 text-sm font-semibold leading-relaxed outline-none placeholder:text-black/28 focus:border-[#ad5b2b]" />
      </label>

      <button type="submit" disabled={status === "saving" || status === "sent"} className="mt-6 min-h-14 w-full rounded-md bg-[#ad5b2b] px-6 text-sm font-black text-white transition hover:bg-[#8d4822] disabled:cursor-not-allowed disabled:opacity-60">
        {status === "saving" ? "Sending..." : status === "sent" ? "Sent. We will reply soon." : "Send my enquiry"}
      </button>

      {status === "error" && <p className="mt-3 text-sm font-bold text-red-700">Could not send this. Email hello@klarai.uk instead.</p>}
      <p className="mt-4 text-xs font-semibold leading-relaxed text-black/42">No newsletter trap. Just enough detail to reply with the right next step.</p>
    </form>
  );
}
