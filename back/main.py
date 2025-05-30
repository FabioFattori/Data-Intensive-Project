from datetime import datetime
import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import make_response
import serverState as ss
from PIL import Image
import base64

# Ottieni il percorso assoluto della cartella principale (AmbrogioAI)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UPLOAD_FOLDER = os.path.abspath(BASE_DIR+ "/backend/uploads")

# Aggiungi "AmbrogioAI" al percorso dei moduli importabili
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
            return jsonify({
                "the fuck is this my nigga??? " : data['model']
            })

    ss.ServerState().set_model(modelName)
    return jsonify()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print("GETTED DATA FROM FRONT => ",data)
    model = ss.ServerState().get_model() 
    if model is None:
        return jsonify({"error": "Nessun modello selezionato"}), 400

    # get the passed image from the request
    prediction = ss.ServerState().handlePrediction(data)

    return jsonify({"prediction": prediction})


if __name__ == "__main__":
    # start the server in debug
    app.run()