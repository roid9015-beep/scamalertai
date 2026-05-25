import { NextResponse } from "next/server";
import { adminDb, verifyBearerToken } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = await verifyBearerToken(request);
  if (!token) return NextResponse.json({ error: "Necesitas iniciar sesión." }, { status: 401 });

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const planId = process.env.PAYPAL_PLAN_ID;
  const env = process.env.PAYPAL_ENV === "live" ? "api-m.paypal.com" : "api-m.sandbox.paypal.com";

  if (!clientId || !secret || !planId) {
    return NextResponse.json({ error: "PayPal no está configurado." }, { status: 500 });
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const tokenResponse = await fetch(`https://${env}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const tokenData = await tokenResponse.json();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const subscriptionResponse = await fetch(`https://${env}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: token.uid,
      application_context: {
        brand_name: "ScamAlert AI",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${appUrl}/dashboard?premium=pending`,
        cancel_url: `${appUrl}/billing?cancelled=true`
      }
    })
  });

  const subscription = await subscriptionResponse.json();
  const approveUrl = subscription.links?.find((link: { rel: string; href: string }) => link.rel === "approve")?.href;

  await adminDb().collection("users").doc(token.uid).set(
    {
      paypalSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status || "CREATED",
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  return NextResponse.json({ approveUrl });
}
