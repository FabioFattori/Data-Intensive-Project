@echo off
SET VENV_DIR=venv

echo Creating virtual environment...
python -m venv %VENV_DIR%

echo Activating virtual environment...
call %VENV_DIR%\Scripts\activate

echo Writing requirements.txt...
(
echo kagglehub
echo pandas
echo matplotlib
echo seaborn
echo scikit-learn
echo numpy
echo flask
echo flask-cors
) > requirements.txt

echo Installing requirements...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo Setup complete. Environment activated.
echo Ready to run your application!
