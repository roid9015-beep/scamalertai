import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const event = await request.json();
  const verified = await verifyPayPalWebhook(request, event);
  if (!verified) {
    return NextResponse.json({ error: "Webhook no verificado." }, { status: 401 });
  }

  const subscriptionId = event.resource?.id || event.resource?.billing_agreement_id;
  const userId = event.resource?.custom_id;
  const status = String(event.event_type || "");
  const eventPlanId: string = event.resource?.plan_id || "";

  if (userId) {
    const isPremiumEvent =
      status.includes("ACTIVATED") || status.includes("PAYMENT.SALE.COMPLETED");

    let plan: "free" | "premium" | "premium_family" = "free";
    let planType: "personal" | "family" | null = null;

    if (isPremiumEvent) {
      const familyPlanId = process.env.PAYPAL_PLAN_ID_FAMILY || "";
      const personalPlanId = process.env.PAYPAL_PLAN_ID_PERSONAL || "";

      if (familyPlanId && eventPlanId === familyPlanId) {
        plan = "premium_family";
        planType = "family";
      } else if (personalPlanId && eventPlanId === personalPlanId) {
        plan = "premium";
        planType = "personal";
      } else {
        // Fallback: check planType already stored in Firestore for this user
        const userDoc = await adminDb().collection("users").doc(userId).get();
        const storedPlanType = userDoc.data()?.planType;
        plan = storedPlanType === "family" ? "premium_family" : "premium";
        planType = storedPlanType || "personal";
      }
    }

    await adminDb()
      .collection("users")
      .doc(userId)
      .set(
        {
          plan,
          ...(planType ? { planType } : {}),
          paypalSubscriptionId: subscriptionId || null,
          subscriptionStatus: status,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
  }

  return NextResponse.json({ received: true });
}

async function verifyPayPalWebhook(request: Request, event: unknown) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const env = process.env.PAYPAL_ENV === "live" ? "api-m.paypal.com" : "api-m.sandbox.paypal.com";

  if (!clientId || !secret || !webhookId) return false;

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

  const verificationResponse = await fetch(
    `https://${env}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auth_algo: request.headers.get("paypal-auth-algo"),
        cert_url: request.headers.get("paypal-cert-url"),
        transmission_id: request.headers.get("paypal-transmission-id"),
        transmission_sig: request.headers.get("paypal-transmission-sig"),
        transmission_time: request.headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: event
      })
    }
  );
  const verification = await verificationResponse.json();
  return verification.verification_status === "SUCCESS";
}
