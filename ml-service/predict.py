from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "fraud_model.pkl"
)

model = joblib.load(MODEL_PATH)

FEATURES = [
    "amount",
    "riskScore",
    "deviceFrequency",
    "userFrequency",
    "sharedDevice",
    "merchantRisk"
]


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "FraudShield-X ML Service is running",
        "model": "fraud_model.pkl",
        "mode": "Hybrid ML + Risk Intelligence"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No JSON data received"
            }), 400

        amount = float(data.get("amount", 0))
        risk_score = float(data.get("riskScore", 0))
        device_frequency = float(data.get("deviceFrequency", 1))
        user_frequency = float(data.get("userFrequency", 1))
        shared_device = int(data.get("sharedDevice", 0))
        merchant_risk = int(data.get("merchantRisk", 0))

        input_data = {
            "amount": amount,
            "riskScore": risk_score,
            "deviceFrequency": device_frequency,
            "userFrequency": user_frequency,
            "sharedDevice": shared_device,
            "merchantRisk": merchant_risk
        }

        input_df = pd.DataFrame(
            [input_data],
            columns=FEATURES
        )

        prediction = int(model.predict(input_df)[0])

        probabilities = model.predict_proba(input_df)[0]

        model_probability = float(probabilities[1] * 100)

        risk_signals = []

        if amount >= 100000:
            risk_signals.append(
                "Extremely high transaction amount detected."
            )
        elif amount >= 50000:
            risk_signals.append(
                "Very high transaction amount detected."
            )

        if risk_score >= 80:
            risk_signals.append(
                "Critical rule-based risk score detected."
            )
        elif risk_score >= 60:
            risk_signals.append(
                "High rule-based risk score detected."
            )

        if shared_device >= 1:
            risk_signals.append(
                "Shared device associated with multiple users."
            )

        if merchant_risk >= 70:
            risk_signals.append(
                "High-risk merchant detected."
            )

        if device_frequency >= 5:
            risk_signals.append(
                "High device transaction frequency detected."
            )

        if user_frequency >= 5:
            risk_signals.append(
                "High user transaction frequency detected."
            )

        final_probability = model_probability
        final_prediction = prediction
        decision_reason = "ML model prediction"

        if amount >= 100000:

            final_probability = max(
                final_probability,
                95.0
            )

            final_prediction = 1

            decision_reason = (
                "Critical high-value transaction risk signal"
            )

        elif amount >= 50000 and risk_score >= 60:

            final_probability = max(
                final_probability,
                90.0
            )

            final_prediction = 1

            decision_reason = (
                "High transaction amount combined with high risk score"
            )

        elif merchant_risk >= 80 and risk_score >= 60:

            final_probability = max(
                final_probability,
                90.0
            )

            final_prediction = 1

            decision_reason = (
                "High-risk merchant and risk score"
            )

        elif model_probability >= 70:

            final_prediction = 1

            decision_reason = (
                "ML model detected high fraud probability"
            )

        is_fraud = final_prediction == 1

        if is_fraud:
            status = "FRAUD"
        elif final_probability >= 40:
            status = "SUSPICIOUS"
        else:
            status = "SAFE"

        return jsonify({
            "success": True,
            "prediction": int(final_prediction),
            "isFraud": is_fraud,
            "status": status,
            "fraudProbability": round(final_probability, 2),
            "modelProbability": round(model_probability, 2),
            "decisionReason": decision_reason,
            "riskSignals": risk_signals,
            "features": input_data
        })

    except Exception as error:

        print("Prediction error:", str(error))

        return jsonify({
            "success": False,
            "message": "Prediction failed",
            "error": str(error)
        }), 500


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 8000))

    print("========================================")
    print("FraudShield-X ML Service")
    print("========================================")
    print("Model loaded successfully")
    print("Hybrid ML + Risk Intelligence enabled")
    print(f"ML API running on port {port}")
    print("========================================")

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )