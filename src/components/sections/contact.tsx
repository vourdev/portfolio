"use client";
import { useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactState } from "@/app/actions";
import { SectionHeading } from "@/components/section";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { socialIcons } from "@/lib/icon-map";
import type { SocialKey } from "@/lib/site";
import type { SiteProfile, SocialView } from "@/lib/content";
import {
  IconSend,
  IconMapPin,
  IconMail,
  IconCircleCheck,
  IconAlertCircle,
  IconLoader2,
} from "@tabler/icons-react";

const initialState: ContactState = { ok: false };

export function Contact({
  profile,
  socials,
}: {
  profile: SiteProfile;
  socials: SocialView[];
}) {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-black/5 px-6 py-20 md:px-12 md:py-28 dark:border-white/5"
    >
      <div className="hidden dark:block">
        <BackgroundBeams className="opacity-60" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something"
            description="Have a project in mind, a role to fill, or just want to say hi? Drop me a message — I read every one."
          />

          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                <IconMail size={18} className="text-blue-500 dark:text-blue-400" />
              </span>
              {profile.email}
            </a>
            <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                <IconMapPin
                  size={18}
                  className="text-blue-500 dark:text-blue-400"
                />
              </span>
              {profile.location}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon as SocialKey];
              if (!Icon) return null;
              const external = social.href.startsWith("http");
              return (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.name}
                  title={social.name}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-neutral-500 transition-colors hover:border-black/20 hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-100"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <form
          ref={formRef}
          action={formAction}
          className="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-neutral-950/70"
        >
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className={inputClass}
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Message" htmlFor="message">
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project…"
                className={`${inputClass} resize-none`}
              />
            </Field>

            {state.ok && state.message && (
              <p className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                <IconCircleCheck size={18} className="shrink-0" />
                {state.message}
              </p>
            )}
            {!state.ok && state.error && (
              <p className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                <IconAlertCircle size={18} className="shrink-0" />
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-neutral-50 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
            >
              {pending ? (
                <>
                  <IconLoader2 size={18} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <IconSend size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-blue-500/50 focus:bg-black/[0.07] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:bg-white/[0.07]";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </span>
      {children}
    </label>
  );
}
