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
# MODEL FEATURES
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
        "model": "fraud_model.pkl",
        "mode": "Hybrid ML + Risk Intelligence"
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


        # =================================================
        # INPUT FEATURES
        # =================================================

        amount = float(
            data.get("amount", 0)
        )

        risk_score = float(
            data.get("riskScore", 0)
        )

        device_frequency = float(
            data.get("deviceFrequency", 1)
        )

        user_frequency = float(
            data.get("userFrequency", 1)
        )

        shared_device = int(
            data.get("sharedDevice", 0)
        )

        merchant_risk = int(
            data.get("merchantRisk", 0)
        )


        input_data = {

            "amount": amount,

            "riskScore": risk_score,

            "deviceFrequency": device_frequency,

            "userFrequency": user_frequency,

            "sharedDevice": shared_device,

            "merchantRisk": merchant_risk

        }


        # =================================================
        # CREATE DATAFRAME
        # =================================================

        input_df = pd.DataFrame(
            [input_data],
            columns=FEATURES
        )


        # =================================================
        # MODEL PREDICTION
        # =================================================

        prediction = int(
            model.predict(input_df)[0]
        )


        probabilities = model.predict_proba(
            input_df
        )[0]


        model_probability = float(
            probabilities[1] * 100
        )


        # =================================================
        # HYBRID FRAUD INTELLIGENCE
        #
        # The trained ML model remains the primary model.
        # Additional high-risk signals prevent obviously
        # dangerous transactions from being classified SAFE.
        # =================================================

        risk_signals = []


        # Very high transaction amount
        if amount >= 100000:

            risk_signals.append(
                "Extremely high transaction amount detected."
            )


        elif amount >= 50000:

            risk_signals.append(
                "Very high transaction amount detected."
            )


        # High rule-based score
        if risk_score >= 80:

            risk_signals.append(
                "Critical rule-based risk score detected."
            )


        elif risk_score >= 60:

            risk_signals.append(
                "High rule-based risk score detected."
            )


        # Shared device
        if shared_device >= 1:

            risk_signals.append(
                "Shared device associated with multiple users."
            )


        # Merchant risk
        if merchant_risk >= 70:

            risk_signals.append(
                "High-risk merchant detected."
            )


        # Unusual frequency
        if device_frequency >= 5:

            risk_signals.append(
                "High device transaction frequency detected."
            )


        if user_frequency >= 5:

            risk_signals.append(
                "High user transaction frequency detected."
            )


        # =================================================
        # FINAL HYBRID DECISION
        # =================================================

        final_probability = model_probability

        final_prediction = prediction

        decision_reason = "ML model prediction"


        # Critical amount signal
        if amount >= 100000:

            final_probability = max(
                final_probability,
                95.0
            )

            final_prediction = 1

            decision_reason = (
                "Critical high-value transaction "
                "risk signal"
            )


        # Strong combined risk
        elif (
            amount >= 50000
            and risk_score >= 60
        ):

            final_probability = max(
                final_probability,
                90.0
            )

            final_prediction = 1

            decision_reason = (
                "High transaction amount combined "
                "with high risk score"
            )


        # High merchant risk
        elif (
            merchant_risk >= 80
            and risk_score >= 60
        ):

            final_probability = max(
                final_probability,
                90.0
            )

            final_prediction = 1

            decision_reason = (
                "High-risk merchant and risk score"
            )


        # Strong ML prediction
        elif model_probability >= 70:

            final_prediction = 1

            decision_reason = (
                "ML model detected high fraud probability"
            )


        # =================================================
        # FINAL STATUS
        # =================================================

        is_fraud = bool(
            final_prediction == 1
        )


        if is_fraud:

            status = "FRAUD"

        elif final_probability >= 40:

            status = "SUSPICIOUS"

        else:

            status = "SAFE"


        # =================================================
        # RESPONSE
        # =================================================

        return jsonify({

            "success": True,

            "prediction": int(
                final_prediction
            ),

            "isFraud": is_fraud,

            "status": status,

            "fraudProbability": round(
                final_probability,
                2
            ),

            "modelProbability": round(
                model_probability,
                2
            ),

            "decisionReason": decision_reason,

            "riskSignals": risk_signals,

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
    print("Hybrid ML + Risk Intelligence enabled")
    print("ML API running on port 8000")
    print("http://127.0.0.1:8000")
    print("========================================")
    print()

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=False
    )