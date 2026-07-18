import { redirect } from "next/navigation";
import { SITE } from "@/config/site";
import SignupPageClient from "./SignupPageClient";

export default function SignupPage() {
  if (!SITE.advertiserPortalEnabled) {
    redirect("/advertisers");
  }

  return <SignupPageClient />;
}
