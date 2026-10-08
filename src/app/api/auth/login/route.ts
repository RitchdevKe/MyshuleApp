import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1. Find User
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenantUsers: {
          include: {
            role: true,
            tenant: true,
          }
        }
      }
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ error: "Invalid credentials or inactive account" }, { status: 401 });
    }

    // 2. Verify Password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Find Tenant Profile mapping based on Hostname
    const host = request.headers.get("host") || "";
    let tenantUser = user.tenantUsers.find((tu: any) => tu.tenant && host.includes(tu.tenant.domainPrefix));
    
    // Fallback to the first tenant if no domain matches exactly
    if (!tenantUser) {
      tenantUser = user.tenantUsers[0];
    }

    if (!tenantUser) {
      return NextResponse.json({ error: "User is not assigned to any school" }, { status: 403 });
    }

    // 4. Generate Session Token
    const token = await signToken({
      userId: user.id,
      tenantId: tenantUser.tenantId,
      roleId: tenantUser.roleId,
      roleName: tenantUser.role.name,
      branchId: tenantUser.branchId,
    });

    // 5. Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // 6. Set HTTP-Only Cookie
    const response = NextResponse.json({ success: true, role: tenantUser.role.name }, { status: 200 });
    response.cookies.set("myshule_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
