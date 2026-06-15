import { Contact } from "@/components/sections/contact";
import { getProfile, getSocials } from "@/lib/content";

export const metadata = { title: "Contact" };

export default async function Page() {
  const [profile, socials] = await Promise.all([getProfile(), getSocials()]);
  return <Contact profile={profile} socials={socials} />;
}
