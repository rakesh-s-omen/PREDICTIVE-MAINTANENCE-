from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
from keras.models import load_model
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Load model, scaler, and threshold
model = load_model("lstm_autoencoder_model_final.h5")
scaler = joblib.load("minmax_scaler.pkl")

THRESHOLD = 0.17048248383850562

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Expecting JSON: { "data": [values] }
        data = request.json.get('data', [])

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Scale input
        data_scaled = scaler.transform([data])  # shape: (1, n_features)

        # Predict using LSTM autoencoder
        reconstructed = model.predict(data_scaled)
        mse = np.mean(np.power(data_scaled - reconstructed, 2))
        is_anomaly = mse > THRESHOLD

        return jsonify({
            'timestamp': datetime.now().isoformat(),
            'input': data,
            'mse': round(float(mse), 6),
            'threshold': THRESHOLD,
            'is_anomaly': is_anomaly
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
