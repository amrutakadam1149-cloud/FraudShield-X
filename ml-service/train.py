import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier


# =====================================================
# TRAINING DATA
# =====================================================

data = {
    "amount": [
        500,
        1200,
        2500,
        5000,
        8000,
        15000,
        25000,
        50000,
        75000,
        100000,
        150000,
        200000,
        300000,
        450,
        900,
        1800,
        7000,
        20000,
        60000,
        120000
    ],

    "riskScore": [
        5,
        8,
        10,
        12,
        15,
        20,
        35,
        45,
        55,
        65,
        80,
        90,
        95,
        5,
        10,
        15,
        20,
        40,
        70,
        85
    ],

    "deviceFrequency": [
        1,
        1,
        2,
        1,
        2,
        2,
        3,
        4,
        5,
        6,
        8,
        10,
        15,
        1,
        2,
        1,
        3,
        4,
        7,
        9
    ],

    "userFrequency": [
        1,
        1,
        1,
        2,
        2,
        2,
        3,
        3,
        4,
        5,
        6,
        8,
        10,
        1,
        1,
        2,
        2,
        3,
        5,
        7
    ],

    "sharedDevice": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],

    "merchantRisk": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],

    # 0 = SAFE
    # 1 = FRAUD
    "fraud": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ]
}


# =====================================================
# CREATE DATAFRAME
# =====================================================

df = pd.DataFrame(data)

print("Training dataset:")
print(df)


# =====================================================
# FEATURES AND TARGET
# =====================================================

features = [
    "amount",
    "riskScore",
    "deviceFrequency",
    "userFrequency",
    "sharedDevice",
    "merchantRisk"
]

X = df[features]
y = df["fraud"]


# =====================================================
# TRAIN RANDOM FOREST MODEL
# =====================================================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)


# =====================================================
# SAVE MODEL
# =====================================================

joblib.dump(
    model,
    "fraud_model.pkl"
)

print()
print("========================================")
print("FraudShield-X ML Model Training Complete")
print("========================================")
print("Model saved as: fraud_model.pkl")
print("Features:", features)