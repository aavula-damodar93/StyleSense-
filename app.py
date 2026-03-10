"""
StyleSense Backend - app.py
Flask API with AI-powered outfit recommendations using image analysis
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import base64
import json
import random
import hashlib
from datetime import datetime

app = Flask(__name__, static_folder='.')
CORS(app)  # Allow cross-origin requests from the frontend

# -------------------------------------------------------
# Configuration
# -------------------------------------------------------
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Demo user database (in production, use a real DB like PostgreSQL)
USERS_DB = {
    "demo@stylesense.com": {
        "password_hash": hashlib.sha256("demo123".encode()).hexdigest(),
        "name": "Style User",
        "preferences": {"colors": [], "style": "casual"}
    }
}

# Sessions store
SESSIONS = {}

# -------------------------------------------------------
# Outfit Analysis Engine (simulates AI scoring)
# -------------------------------------------------------

COLOR_HARMONY_TIPS = {
    "high": [
        "Exceptional color harmony — the tones complement each other perfectly.",
        "Beautiful tonal balance with excellent contrast. This palette is sophisticated.",
        "The color palette here is cohesive and visually striking. Well done.",
    ],
    "medium": [
        "Good color foundation. A slight tonal adjustment would elevate this further.",
        "Solid colors that work together. Consider a neutral to anchor the look.",
        "Colors are complementary with minor adjustments recommended.",
    ],
    "low": [
        "The colors create some visual tension. A neutral piece would bring harmony.",
        "Color contrast is high — intentional or not, consider simplifying the palette.",
        "The colors compete for attention. Anchor the look with a neutral base piece.",
    ]
}

STYLE_SCORES = [
    {"base": 95, "label": "Perfect Match", "tier": "high"},
    {"base": 89, "label": "Excellent Match", "tier": "high"},
    {"base": 82, "label": "Great Match", "tier": "high"},
    {"base": 75, "label": "Good Match", "tier": "medium"},
    {"base": 66, "label": "Fair Match", "tier": "medium"},
    {"base": 57, "label": "Moderate Match", "tier": "medium"},
    {"base": 43, "label": "Needs Styling Work", "tier": "low"},
    {"base": 31, "label": "Restyle Recommended", "tier": "low"},
]

STYLE_REMARKS = [
    "Every piece in this outfit harmonizes beautifully — silhouette, texture, and color all work in concert. A definitive style winner.",
    "Outstanding combination with excellent tonal balance. The accessories and footwear choice elevate this look significantly.",
    "Strong outfit with great visual flow. Minor tweaks — a complementary accessory or footwear swap — would push this to perfection.",
    "Solid combination that communicates clear style intent. Consider layering a neutral piece to ground the look.",
    "Decent combination that works for casual settings. The pieces are strong individually; pair more intentionally for formal occasions.",
    "Moderate score — the outfit has potential but the individual elements compete rather than collaborate. A belt or scarf would unify.",
    "The pieces clash in style vocabulary. Identify your dominant aesthetic and build outward from one hero piece.",
    "This combination needs a rethink. Stick to one statement piece and let the rest be neutral, supporting players."
]


def analyze_outfit_image(file_data: bytes, filename: str) -> dict:
    """
    Simulates AI analysis of an outfit image.
    In production, this would call an actual vision AI model
    (e.g., Claude claude-opus-4-6, GPT-4V, or a custom fashion ML model).
    """
    # Use file hash to create reproducible but varied scores
    file_hash = int(hashlib.md5(file_data[:512]).hexdigest(), 16)
    random.seed(file_hash)

    # Simulate AI scoring (variance ±5)
    base_variance = random.randint(-5, 5)

    return {
        "filename": filename,
        "file_hash": hashlib.md5(file_data[:512]).hexdigest()[:8],
        "analysis": {
            "color_harmony": random.uniform(0.4, 1.0),
            "style_coherence": random.uniform(0.4, 1.0),
            "occasion_fit": random.uniform(0.5, 1.0),
            "trend_score": random.uniform(0.3, 1.0),
        },
        "variance": base_variance
    }


def rank_outfits(analyses: list) -> list:
    """Sort and rank outfit analyses by composite AI score."""
    def composite_score(a):
        metrics = a["analysis"]
        raw = (
            metrics["color_harmony"] * 0.35 +
            metrics["style_coherence"] * 0.30 +
            metrics["occasion_fit"] * 0.20 +
            metrics["trend_score"] * 0.15
        )
        return raw + (a["variance"] / 100)

    sorted_analyses = sorted(analyses, key=composite_score, reverse=True)
    ranked = []

    for i, item in enumerate(sorted_analyses):
        score_data = STYLE_SCORES[min(i, len(STYLE_SCORES) - 1)]
        tier = score_data["tier"]

        # Add small random variation to score
        random.seed(int(item["file_hash"], 16))
        score_variation = random.randint(-3, 3)
        final_score = max(10, min(99, score_data["base"] + score_variation))

        remark = STYLE_REMARKS[min(i, len(STYLE_REMARKS) - 1)]
        color_tip = random.choice(COLOR_HARMONY_TIPS[tier])

        ranked.append({
            "rank": i + 1,
            "filename": item["filename"],
            "score": final_score,
            "label": score_data["label"],
            "remark": remark,
            "color_tip": color_tip,
            "analysis": item["analysis"]
        })

    return ranked


# -------------------------------------------------------
# API Routes
# -------------------------------------------------------

@app.route('/')
def serve_login():
    """Serve the login page."""
    return send_from_directory('.', 'login.html')


@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static frontend files."""
    return send_from_directory('.', filename)


@app.route('/api/login', methods=['POST'])
def login():
    """
    Authenticate user and return session token.
    POST /api/login
    Body: { "email": "...", "password": "..." }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Demo: accept any valid email + password (min 6 chars)
    # In production, check against USERS_DB or a real database
    if len(password) < 6:
        return jsonify({"error": "Invalid credentials"}), 401

    # Create session
    session_token = hashlib.sha256(f"{email}{datetime.now().isoformat()}".encode()).hexdigest()
    SESSIONS[session_token] = {
        "email": email,
        "name": email.split('@')[0],
        "created_at": datetime.now().isoformat()
    }

    return jsonify({
        "success": True,
        "token": session_token,
        "user": {
            "email": email,
            "name": email.split('@')[0]
        }
    })


@app.route('/api/analyze-outfits', methods=['POST'])
def analyze_outfits():
    """
    Analyze uploaded outfit images and return ranked results.
    POST /api/analyze-outfits
    Body: multipart/form-data with image files
    """
    if 'images' not in request.files:
        return jsonify({"error": "No images provided"}), 400

    files = request.files.getlist('images')
    if not files:
        return jsonify({"error": "No image files found"}), 400

    if len(files) > 10:
        return jsonify({"error": "Maximum 10 images allowed"}), 400

    analyses = []
    for f in files:
        if f.filename == '':
            continue

        # Read file data
        file_data = f.read()

        # Validate it's an image (basic check)
        if not f.content_type.startswith('image/'):
            continue

        # Analyze the outfit
        analysis = analyze_outfit_image(file_data, f.filename)
        analyses.append(analysis)

    if not analyses:
        return jsonify({"error": "No valid image files found"}), 400

    # Rank the outfits
    rankings = rank_outfits(analyses)

    return jsonify({
        "success": True,
        "total_outfits": len(rankings),
        "rankings": rankings,
        "analyzed_at": datetime.now().isoformat()
    })


@app.route('/api/event-suggestions', methods=['GET'])
def get_event_suggestions():
    """
    Get AI-powered outfit suggestions for a specific event.
    GET /api/event-suggestions?event=wedding&category=men
    """
    event = request.args.get('event', 'casual')
    category = request.args.get('category', 'all')

    # Import suggestions from a comprehensive dataset
    # In production, this would query a fashion AI model
    suggestions_map = {
        "wedding": {
            "men": [
                {"title": "Royal Sherwani", "pieces": ["Silk Sherwani", "Churidar", "Mojri Shoes", "Turban"], "tip": "Choose ivory or cream with gold embroidery for maximum impact."},
                {"title": "Classic Bandhgala", "pieces": ["Bandhgala Suit", "Slim Trousers", "Leather Shoes"], "tip": "A well-tailored bandhgala in jewel tones is eternally sophisticated."}
            ],
            "women": [
                {"title": "Bridal Silk Saree", "pieces": ["Kanjivaram Saree", "Silk Blouse", "Gold Jewelry", "Heels"], "tip": "Deep reds and gold are the quintessential bridal palette."},
                {"title": "Designer Lehenga", "pieces": ["Embroidered Lehenga", "Crop Blouse", "Dupatta", "Bangles"], "tip": "Let the embroidery do the talking — keep accessories minimal."}
            ]
        },
        "office": {
            "men": [
                {"title": "Executive Classic", "pieces": ["White Shirt", "Navy Trousers", "Oxford Shoes", "Leather Belt"], "tip": "A crisp white shirt is the most versatile professional investment."}
            ],
            "women": [
                {"title": "Power Blazer", "pieces": ["Structured Blazer", "Wide Leg Trousers", "Heels"], "tip": "A well-fitted blazer projects authority and confidence."}
            ]
        }
    }

    event_data = suggestions_map.get(event, suggestions_map["office"])

    if category != 'all' and category in event_data:
        result = {category: event_data[category]}
    else:
        result = event_data

    return jsonify({"success": True, "event": event, "suggestions": result})


@app.route('/api/color-preferences', methods=['POST'])
def save_color_preferences():
    """
    Save user color preferences.
    POST /api/color-preferences
    Body: { "token": "...", "colors": ["#hex1", "#hex2", ...] }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    colors = data.get('colors', [])
    token = data.get('token', '')

    if token not in SESSIONS:
        return jsonify({"error": "Unauthorized"}), 401

    SESSIONS[token]['color_preferences'] = colors

    return jsonify({
        "success": True,
        "message": f"Saved {len(colors)} color preferences",
        "colors": colors
    })


@app.route('/api/wardrobe', methods=['POST'])
def upload_wardrobe():
    """
    Upload wardrobe items.
    POST /api/wardrobe
    Body: multipart/form-data with image files
    """
    if 'items' not in request.files:
        return jsonify({"error": "No items provided"}), 400

    files = request.files.getlist('items')
    saved = []

    for f in files:
        if f.filename and f.content_type.startswith('image/'):
            # In production, save to cloud storage (S3, GCS, etc.)
            filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{f.filename}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            f.save(filepath)
            saved.append(filename)

    return jsonify({
        "success": True,
        "uploaded": len(saved),
        "items": saved
    })


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "service": "StyleSense API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })


# -------------------------------------------------------
# Main Entry Point
# -------------------------------------------------------
if __name__ == '__main__':
    print("=" * 50)
    print("  StyleSense Fashion AI Backend")
    print("  Running on http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000, host='0.0.0.0')
