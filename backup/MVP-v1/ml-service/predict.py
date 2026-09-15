from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os


app = Flask(__name__)
CORS(app)


# =====================================================
# LOAD TRAINED MODEL
# =====================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "fraud_model.pkl"
)

model = joblib.load(MODEL_PATH)


# =====================================================
# FEATURES USED BY THE MODEL
# =====================================================

FEATURES = [
    "amount",
    "riskScore",
    "deviceFrequency",
    "userFrequency",
    "sharedDevice",
    "merchantRisk"
]


# =====================================================
# HEALTH CHECK
# =====================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "FraudShield-X ML Service is running",
        "model": "fraud_model.pkl"
    })


# =====================================================
# FRAUD PREDICTION
# =====================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No JSON data received"
            }), 400


        # -------------------------------------------------
        # Prepare input
        # -------------------------------------------------

        input_data = {
            "amount": float(data.get("amount", 0)),
            "riskScore": float(data.get("riskScore", 0)),
            "deviceFrequency": float(
                data.get("deviceFrequency", 1)
            ),
            "userFrequency": float(
                data.get("userFrequency", 1)
            ),
            "sharedDevice": int(
                data.get("sharedDevice", 0)
            ),
            "merchantRisk": int(
                data.get("merchantRisk", 0)
            )
        }


        # -------------------------------------------------
        # Convert to DataFrame
        # -------------------------------------------------

        input_df = pd.DataFrame(
            [input_data],
            columns=FEATURES
        )


        # -------------------------------------------------
        # Prediction
        # -------------------------------------------------

        prediction = model.predict(input_df)[0]


        # -------------------------------------------------
        # Prediction probability
        # -------------------------------------------------

        probabilities = model.predict_proba(input_df)[0]

        fraud_probability = float(
            probabilities[1] * 100
        )


        # -------------------------------------------------
        # Result
        # -------------------------------------------------

        is_fraud = bool(prediction == 1)

        status = (
            "FRAUD"
            if is_fraud
            else "SAFE"
        )


        return jsonify({

            "success": True,

            "prediction": int(prediction),

            "isFraud": is_fraud,

            "status": status,

            "fraudProbability": round(
                fraud_probability,
                2
            ),

            "features": input_data

        })


    except Exception as error:

        print(
            "Prediction error:",
            str(error)
        )

        return jsonify({

            "success": False,

            "message": "Prediction failed",

            "error": str(error)

        }), 500


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    print()
    print("========================================")
    print("FraudShield-X ML Service")
    print("========================================")
    print("Model loaded successfully")
    print("ML API running on port 8000")
    print("========================================")
    print()

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=False
    )