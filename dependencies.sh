#!/bin/bash

VENV_DIR=venv

echo "Creating virtual environment..."
python3 -m venv "$VENV_DIR"

echo "Activating virtual environment..."
source "$VENV_DIR/bin/activate"

echo "Writing requirements.txt..."
cat > requirements.txt << EOL
kagglehub
pandas
matplotlib
seaborn
scikit-learn
numpy
flask
flask-cors
EOL

echo "Installing requirements..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "Setup complete. Environment activated."
echo "Ready to run your application!"
