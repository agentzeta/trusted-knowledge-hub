
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get all API keys from environment variables
    const apiKeys = {
      openai: Deno.env.get('OPENAI_API_KEY') || '',
      anthropic: Deno.env.get('ANTHROPIC_API_KEY') || '',
      anthropicClaude35: Deno.env.get('ANTHROPIC_CLAUDE35_API_KEY') || '',
      gemini: Deno.env.get('GEMINI_API_KEY') || '',
      geminiProExperimental: Deno.env.get('GEMINI_PRO_EXP_API_KEY') || '',
      perplexity: Deno.env.get('PERPLEXITY_API_KEY') || '',
      deepseek: Deno.env.get('DEEPSEEK_API_KEY') || '',
      grok: Deno.env.get('GROK_API_KEY') || '',
      qwen: Deno.env.get('QWEN_API_KEY') || '',
      openrouter: Deno.env.get('OPENROUTER_API_KEY') || '',
    };

    // Log which keys are available (without revealing the actual keys)
    const availableKeys = Object.entries(apiKeys)
      .filter(([_, value]) => value && value.length > 0)
      .map(([key]) => key);
    
    console.log(`Available API keys: ${availableKeys.join(', ')}`);
    
    return new Response(
      JSON.stringify({ 
        apiKeys,
        availableKeys
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error("Error in API Keys function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
