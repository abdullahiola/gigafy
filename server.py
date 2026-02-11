import os
import io
import base64
import logging
import replicate
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pyngrok import ngrok

# ── Load environment variables from .env.local ──────────────────────────────
load_dotenv(".env.local")

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# ── Flask app ────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # Allow requests from the Next.js frontend


# ── Health check ─────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


# ── Gigafy endpoint ─────────────────────────────────────────────────────────
@app.route("/api/gigafy", methods=["POST"])
def gigafy():
    try:
        # Check for API token
        if not os.environ.get("REPLICATE_API_TOKEN"):
            logger.error("REPLICATE_API_TOKEN is not set")
            return jsonify({"error": "REPLICATE_API_TOKEN not set"}), 500

        # Get the uploaded image
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        image_file = request.files["image"]
        image_bytes = image_file.read()
        mime_type = image_file.content_type or "image/png"

        # Convert to base64 data URI
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        data_uri = f"data:{mime_type};base64,{b64}"

        logger.info("Running google/imagen-4 via Replicate …")

        # Run google/imagen-4 via Replicate
        output = replicate.run(
            "google/imagen-4",
            input={
                "prompt": (
                    "Transform this person into a hyper-masculine GigaChad meme version. "
                    "Give them an extremely chiseled jawline, prominent cheekbones, "
                    "deep-set intense eyes, thick eyebrows, a perfectly sculpted face, "
                    "and a strong muscular neck. Keep the same general pose and background "
                    "but make the person look like the iconic GigaChad meme (Ernest Khalimov). "
                    "Photorealistic, cinematic lighting, dramatic shadows, sharp focus."
                ),
                "image": data_uri,
                "aspect_ratio": "1:1",
                "safety_filter_level": "block_only_high",
            },
        )

        # Handle the output — could be a URL string, FileOutput, or iterator
        if hasattr(output, "url"):
            result_url = output.url
        elif isinstance(output, str):
            result_url = output
        elif hasattr(output, "__iter__"):
            items = list(output)
            if items and hasattr(items[0], "url"):
                result_url = items[0].url
            elif items:
                result_url = str(items[0])
            else:
                return jsonify({"error": "No output from model"}), 500
        else:
            result_url = str(output)

        logger.info("Gigafy complete — returning result URL")
        return jsonify({"url": result_url})

    except Exception as e:
        logger.exception("Gigafy error")
        return jsonify({"error": str(e)}), 500


# ── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import atexit

    PORT = int(os.environ.get("PORT", 5001))

    # Kill any lingering ngrok tunnels from previous runs
    ngrok.kill()

    # Open ngrok tunnel for production access
    public_url = ngrok.connect(PORT).public_url

    # Clean up the tunnel when the process exits
    atexit.register(ngrok.kill)

    print("\n" + "=" * 60)
    print("  🚀  Gigafy Python backend is LIVE")
    print(f"  📍  Local:  http://localhost:{PORT}")
    print(f"  🌍  Public: {public_url}")
    print("=" * 60)
    print(f"\n  Set this in .env.local for your Next.js frontend:")
    print(f"  NEXT_PUBLIC_API_URL={public_url}\n")

    app.run(host="0.0.0.0", port=PORT)
