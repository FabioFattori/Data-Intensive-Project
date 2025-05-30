#!/bin/bash
clear

chmod +x dependencies.sh
./dependencies.sh

VENV_DIR=venv

source "$VENV_DIR/bin/activate"

clear

cd back 

python3 main.py