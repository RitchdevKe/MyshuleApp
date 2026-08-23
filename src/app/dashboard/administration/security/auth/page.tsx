import React from "react";
import AuthClient from "./AuthClient";
import { getAuthCenterConfig } from "@/app/actions/security_auth_center";

export default async function AuthPage() {
  const config = await getAuthCenterConfig();
  return <AuthClient initialConfig={config} />;
}
