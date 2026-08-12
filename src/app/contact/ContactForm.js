"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const goals = ["SEO help", "AI visibility", "Website help", "Not sure yet"];

export default function ContactForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", goal: "Not sure yet", company: "" });
  const [status, setStatus] = useState("idle");

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const next = () => {
    if (step === 0 && !form.name.trim()) return;
    if (step === 1 && !/^\S+@\S+\.\S+$/.test(form.email.trim())) return;
    setStep((current) => Math.min(current + 1, 2));
  };

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (form.company) return setStatus("sent");
    setStatus("saving");

    try {
      await addDoc(collection(db, "leads"), {
        source: "contact_page",
        name: form.name.trim(),
        email: form.email.trim(),
        goal: form.goal,
        capturedAt: serverTimestamp(),
      });
      setStatus("sent");
      setForm({ name: "", email: "", goal: "Not sure yet", company: "" });
    } catch (error) {
      console.error("Contact form failed:", error);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ad5b2b]">Sent</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2f3438]">We will reply soon.</h2>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-black/52">Your enquiry is saved in the admin leads list.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.1rem] border border-black/8 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ad5b2b]">Step {step + 1} of 3</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2f3438]">
            {step === 0 ? "What is your name?" : step === 1 ? "Where should we reply?" : "What do you need?"}
          </h2>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((item) => (
            <span key={item} className={`h-2 w-8 rounded-full ${item <= step ? "bg-[#ad5b2b]" : "bg-black/10"}`} />
          ))}
        </div>
      </div>

      <input tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => update("company", event.target.value)} className="hidden" />

      {step === 0 && (
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Name</span>
          <input autoFocus required value={form.name} onChange={(event) => update("name", event.target.value)} onKeyDown={(event) => event.key === "Enter" && next()} autoComplete="name" className="mt-2 min-h-14 w-full rounded-md border border-black/10 bg-[#f9f5ec] px-4 text-base font-bold outline-none focus:border-[#ad5b2b]" />
        </label>
      )}

      {step === 1 && (
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Email</span>
          <input autoFocus required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} onKeyDown={(event) => event.key === "Enter" && next()} autoComplete="email" className="mt-2 min-h-14 w-full rounded-md border border-black/10 bg-[#f9f5ec] px-4 text-base font-bold outline-none focus:border-[#ad5b2b]" />
        </label>
      )}

      {step === 2 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Optional</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {goals.map((goal) => (
              <button key={goal} type="button" onClick={() => update("goal", goal)} className={`rounded-md border px-4 py-3 text-left text-sm font-black transition ${form.goal === goal ? "border-[#ad5b2b] bg-[#ad5b2b] text-white" : "border-black/10 bg-[#f9f5ec] text-[#2f3438]/64 hover:text-[#2f3438]"}`}>
                {goal}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep((current) => current - 1)} className="min-h-14 rounded-md border border-black/10 px-5 text-sm font-black text-[#2f3438]/64 transition hover:text-[#2f3438]">
            Back
          </button>
        )}
        <button type="button" onClick={step === 2 ? submit : next} disabled={status === "saving"} className="min-h-14 flex-1 rounded-md bg-[#ad5b2b] px-6 text-sm font-black text-white transition hover:bg-[#8d4822] disabled:cursor-not-allowed disabled:opacity-60">
          {status === "saving" ? "Sending..." : step === 2 ? "Send" : "Next"}
        </button>
      </div>

      {status === "error" && <p className="mt-3 text-sm font-bold text-red-700">Could not send this. Email abdullah@klarai.uk instead.</p>}
      <p className="mt-4 text-xs font-semibold leading-relaxed text-black/42">Only name and email are required.</p>
    </div>
  );
}
