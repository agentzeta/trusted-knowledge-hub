
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
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set in environment variables');
      throw new Error('ELEVENLABS_API_KEY is not set');
    }
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error('Invalid JSON in request body');
    }
    
    const { text, voiceId } = requestBody;
    
    if (!text) {
      console.error('Text parameter is missing in request');
      throw new Error('Text is required');
    }
    
    // Default to "Aria" voice if not specified
    const voice = voiceId || "9BWtsMINqrJLrRacOk9x";
    
    console.log(`Converting text to speech using voice ID: ${voice}`);
    console.log(`Text to convert (first 50 chars): ${text.substring(0, 50)}...`);
    
    // Make request to ElevenLabs API with proper error handling
    let response;
    try {
      response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
            "Accept": "audio/mpeg"
          },
          body: JSON.stringify({
            text: text.substring(0, 1000), // Limit text length to prevent quota issues
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );
    } catch (fetchError) {
      console.error("Network error calling ElevenLabs API:", fetchError);
      throw new Error(`Network error: ${fetchError.message}`);
    }

    // Check for API error response
    if (!response.ok) {
      let errorData;
      let errorMessage;
      
      try {
        errorData = await response.json();
        console.error("ElevenLabs API error data:", errorData);
        
        // Check for quota exceeded error
        if (errorData.detail && errorData.detail.status === "quota_exceeded") {
          errorMessage = "ElevenLabs quota exceeded. Please try again later or upgrade your plan.";
        } else {
          errorMessage = errorData.detail?.message || `API error (${response.status})`;
        }
      } catch (e) {
        // If response is not JSON
        const errorText = await response.text();
        errorMessage = `API error (${response.status}): ${errorText.substring(0, 100)}`;
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          code: "ELEVENLABS_API_ERROR",
          status: response.status
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the audio as an ArrayBuffer
    let audioArrayBuffer;
    try {
      audioArrayBuffer = await response.arrayBuffer();
    } catch (error) {
      console.error("Error reading audio response:", error);
      throw new Error(`Error processing audio: ${error.message}`);
    }
    
    console.log(`Received audio response, size: ${audioArrayBuffer.byteLength} bytes`);
    
    if (audioArrayBuffer.byteLength === 0) {
      console.error("Received empty audio response");
      throw new Error("Received empty audio from ElevenLabs");
    }
    
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
      JSON.stringify({ 
        error: error.message || "Unknown error occurred",
        details: error.stack || "No stack trace available",
        code: "INTERNAL_SERVER_ERROR"
      }),
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
