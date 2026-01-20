import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MpesaRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

async function getAccessToken(consumerKey: string, consumerSecret: string): Promise<string> {
  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get M-Pesa access token");
  }

  const data = await response.json();
  return data.access_token;
}

function generateTimestamp(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  const data = `${shortcode}${passkey}${timestamp}`;
  return btoa(data);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const shortcode = Deno.env.get("MPESA_SHORTCODE") || "174379"; // Sandbox default
    const passkey = Deno.env.get("MPESA_PASSKEY");
    const callbackUrl = Deno.env.get("MPESA_CALLBACK_URL");

    if (!consumerKey || !consumerSecret || !passkey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "M-Pesa API credentials not configured. Please add MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, and MPESA_PASSKEY to your secrets." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { phoneNumber, amount, accountReference, transactionDesc }: MpesaRequest = await req.json();

    // Validate phone number (should be in format 254XXXXXXXXX)
    let formattedPhone = phoneNumber.replace(/\s/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (!/^254\d{9}$/.test(formattedPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid phone number format. Use 254XXXXXXXXX or 0XXXXXXXXX" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get access token
    const accessToken = await getAccessToken(consumerKey, consumerSecret);
    const timestamp = generateTimestamp();
    const password = generatePassword(shortcode, passkey, timestamp);

    // Initiate STK Push
    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(amount),
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl || `${Deno.env.get("SUPABASE_URL")}/functions/v1/mpesa-callback`,
          AccountReference: accountReference || "CitiKlin",
          TransactionDesc: transactionDesc || "Payment",
        }),
      }
    );

    const stkData = await stkResponse.json();

    if (stkData.ResponseCode === "0") {
      return new Response(
        JSON.stringify({
          success: true,
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID,
          message: "STK push sent successfully. Please check your phone.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: stkData.errorMessage || stkData.ResponseDescription || "Failed to initiate payment",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: unknown) {
    console.error("M-Pesa STK Push error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
