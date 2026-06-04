import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const env = process.env.PAYPAL_ENV === "live" ? "api-m.paypal.com" : "api-m.sandbox.paypal.com";

  if (!clientId || !secret) {
    return NextResponse.json({ error: "PayPal no configurado" }, { status: 500 });
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const tokenRes = await fetch(`https://${env}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials"
  });
  const { access_token } = await tokenRes.json();

  const productRes = await fetch(`https://${env}/v1/catalogs/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "ScamAlert AI", description: "Protección contra estafas con IA", type: "SERVICE", category: "SOFTWARE" })
  });
  const product = await productRes.json();

  const personalRes = await fetch(`https://${env}/v1/billing/plans`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: product.id,
      name: "ScamAlert AI Premium Personal",
      status: "ACTIVE",
      billing_cycles: [{ frequency: { interval_unit: "MONTH", interval_count: 1 }, tenure_type: "REGULAR", sequence: 1, total_cycles: 0, pricing_scheme: { fixed_price: { value: "2.99", currency_code: "USD" } } }],
      payment_preferences: { auto_bill_outstanding: true, setup_fee: { value: "0", currency_code: "USD" }, setup_fee_failure_action: "CONTINUE", payment_failure_threshold: 1 }
    })
  });
  const personalPlan = await personalRes.json();

  const familyRes = await fetch(`https://${env}/v1/billing/plans`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: product.id,
      name: "ScamAlert AI Premium Familiar",
      status: "ACTIVE",
      billing_cycles: [{ frequency: { interval_unit: "MONTH", interval_count: 1 }, tenure_type: "REGULAR", sequence: 1, total_cycles: 0, pricing_scheme: { fixed_price: { value: "4.99", currency_code: "USD" } } }],
      payment_preferences: { auto_bill_outstanding: true, setup_fee: { value: "0", currency_code: "USD" }, setup_fee_failure_action: "CONTINUE", payment_failure_threshold: 1 }
    })
  });
  const familyPlan = await familyRes.json();

  return NextResponse.json({
    productId: product.id,
    personalPlanId: personalPlan.id,
    familyPlanId: familyPlan.id,
    message: "Copia estos IDs en Vercel como PAYPAL_PLAN_ID_PERSONAL y PAYPAL_PLAN_ID_FAMILY"
  });
}
