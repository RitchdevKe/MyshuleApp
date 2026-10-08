import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

interface SessionPayload {
  userId: string;
  tenantId: string;
  roleId: string;
  roleName: string;
  branchId?: string | null;
}

const secretKey = process.env.JWT_SECRET || "fallback-super-secret-key-change-in-prod";
const encodedKey = new TextEncoder().encode(secretKey);

export async function signToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedKey);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("myshule_session")?.value;
  if (!sessionToken) return null;
  return verifyToken(sessionToken);
}
