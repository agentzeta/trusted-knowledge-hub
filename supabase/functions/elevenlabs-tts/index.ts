
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
    // Get the API key from environment variables
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set in environment variables');
      throw new Error('ELEVENLABS_API_KEY is not set');
    }
    
    // Parse request body
    const { text, voiceId } = await req.json();
    
    if (!text) {
      console.error('No text provided in request');
      throw new Error('Text is required');
    }
    
    // Default to "Aria" voice if not specified
    const voice = voiceId || "9BWtsMINqrJLrRacOk9x";
    
    console.log(`Converting text to speech using voice ID: ${voice}`);
    console.log(`Text to convert (first 50 chars): ${text.substring(0, 50)}...`);
    
    // Make request to ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("ElevenLabs API error response:", errorBody);
      console.error("ElevenLabs API status:", response.status);
      console.error("ElevenLabs API statusText:", response.statusText);
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    // Get the audio as an ArrayBuffer
    const audioArrayBuffer = await response.arrayBuffer();
    
    console.log(`Received audio response, size: ${audioArrayBuffer.byteLength} bytes`);
    
    // Convert to base64
    const audioBase64 = btoa(
      String.fromCharCode(...new Uint8Array(audioArrayBuffer))
    );
    
    return new Response(
      JSON.stringify({ 
        audioContent: audioBase64,
        format: "mp3" 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error("Error in ElevenLabs TTS function:", error);
    
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
