import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import serverState as ss

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UPLOAD_FOLDER = os.path.abspath(BASE_DIR+ "/backend/uploads")

sys.path.insert(0, BASE_DIR)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3039"}})

@app.route("/getTypes", methods=['GET'])
def getTypes():
    # Return the types of the models
    return jsonify({"types": ss.ModelsEnum.getTypes()}), 200

@app.route('/changeModel', methods=['POST'])
def choseAi():
    data = request.get_json()
    print(f"Received data: {data}")
    modelName = ss.ModelsEnum.Null
    match data["model"]:
        case ss.ModelsEnum.Regression:
            modelName = ss.ModelsEnum.Regression
        case ss.ModelsEnum.RandomForest:
            modelName = ss.ModelsEnum.RandomForest
        case ss.ModelsEnum.SVMBinary:
            modelName = ss.ModelsEnum.SVMBinary
        case ss.ModelsEnum.SVMMulti:
            modelName = ss.ModelsEnum.SVMMulti
        case _:
            print("Nessun modello selezionato", data["model"])

    ss.ServerState().set_model(modelName)
    return jsonify({"message": f"Modello cambiato in {modelName}"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    model = ss.ServerState().get_model() 
    if model is None:
        return jsonify({"error": "Nessun modello selezionato"}), 400

    prediction = ss.ServerState().handlePrediction(data)

    return jsonify({"prediction": prediction})

@app.route('/getStatistics', methods=['GET'])
def getStatistics():
    # get the statistics from the server state
    stats = {
        "generic": ss.ServerState().genericStatistics,
        "specific": ss.ServerState().specificStatistics,
        "history": ss.ServerState().history,
    }
    if stats is None:
        return jsonify({"error": "Nessuna statistica disponibile"}), 400

    return jsonify(stats), 200

@app.route('/reset', methods=['POST'])
def reset():
    ss.ServerState().reset()
    return jsonify({"message": "Server state reset"}), 200

if __name__ == "__main__":
    # start the server in debug
    app.run()