import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

    const { Body } = body;
    if (!Body?.stkCallback) {
      return new Response(JSON.stringify({ success: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callback = Body.stkCallback;
    const resultCode = callback.ResultCode;
    const checkoutRequestId = callback.CheckoutRequestID;

    if (resultCode === 0) {
      // Payment successful
      const metadata = callback.CallbackMetadata?.Item || [];
      const amount = metadata.find((i: any) => i.Name === "Amount")?.Value;
      const mpesaReceiptNumber = metadata.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
      const transactionDate = metadata.find((i: any) => i.Name === "TransactionDate")?.Value;
      const phoneNumber = metadata.find((i: any) => i.Name === "PhoneNumber")?.Value;

      // Update payment record in database
      const { error } = await supabase
        .from("payments")
        .update({
          status: "completed",
          mpesa_receipt: mpesaReceiptNumber,
          transaction_id: checkoutRequestId,
          updated_at: new Date().toISOString(),
        })
        .eq("transaction_id", checkoutRequestId);

      if (error) {
        console.error("Error updating payment:", error);
      }

      console.log("Payment successful:", { mpesaReceiptNumber, amount, phoneNumber });
    } else {
      // Payment failed
      const { error } = await supabase
        .from("payments")
        .update({
          status: "failed",
          notes: callback.ResultDesc,
          updated_at: new Date().toISOString(),
        })
        .eq("transaction_id", checkoutRequestId);

      if (error) {
        console.error("Error updating failed payment:", error);
      }

      console.log("Payment failed:", callback.ResultDesc);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Callback error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
