import { About } from "@/components/sections/about";
import { getProfile, getTools } from "@/lib/content";

export default async function Home() {
  const [profile, tools] = await Promise.all([getProfile(), getTools()]);
  return <About profile={profile} tools={tools} />;
}
