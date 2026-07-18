import { redirect } from "next/navigation";
import { SITE } from "@/config/site";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  if (!SITE.advertiserPortalEnabled) {
    redirect("/advertisers");
  }

  return <LoginPageClient />;
}
