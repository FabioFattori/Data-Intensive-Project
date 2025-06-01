## Struttura del Progetto
- /
  - back => Directory contente tutta la parte backend del progetto (flask)
  - front => Directory contente tutta la parte frontend del progetto (react + typescript)
  - ProgettoDataIntensiveFattori.ipynb => Notebook Jupyter con la parte obbligatoria dell'esame
  - dependencies.bat / dependencies.sh => Script per installare le dipendenze del progetto
  - requirements.txt => File con le dipendenze del progetto creato dallo sctript dependencies.bat / dependencies.sh
  - README.md => Questo file
  - startFront.bat / startFront.sh => Script per avviare il frontend del progetto
  - startWebServer.bat / startWebServer.sh => Script per avviare il backend del progetto
# Dipendenze esterne del progetto
Il progetto, più precisamente il frontend, utilizza le seguenti dipendenze esterne:
- [Node.js](https://nodejs.org/en/download/) 
- npm (Node Package Manager) che viene installato automaticamente con node.js

Le seguenti dipendenze sono necessarie per poter avviare il frontend del progetto, altrimenti il comando `npm run dev` e `npm install` non funzionerà.

# Come avviare il progetto
Per avviare il progetto è necessario eseguire due comandi, uno per il backend e uno per il frontend.
## Backend
### Windows 

eseguire il seguente comando in terminale nella root del progetto:
```
startWebServer.bat
```

### Linux / MacOS

eseguire il seguente comando in terminale nella root del progetto:
```
chmod +x startWebServer.sh
./startWebServer.sh
```

#### Spiegazione del comando:
Il comando `startWebServer.bat` / `startWebServer.sh` esegue lo script `dependecies.bat` / `dependecies.sh` per installare le dipendenze del progetto e poi avvia il server Flask del backend del progetto.  
Lo script `dependecies.bat` / `dependecies.sh` controlla che sia presente un virtual environment chiamato `venv` e se non è presente lo crea, e poi lo attiva, una volta fatto ciò installa le dipendenze del progetto presenti nel file `requirements.txt`.  
Se per qualche motivo il virtual environment non viene creato, è possibile crearlo manualmente con il comando:
```
python -m venv venv
```
e poi attivarlo con il comando:
### Windows
```
venv\Scripts\activate
```
### Linux / MacOS
```
source venv/bin/activate
```
Dopo aver attivato il virtual environment, è possibile installare le seguenti dipendenze:
- kagglehub
- pandas
- matplotlib
- seaborn
- scikit-learn
- numpy
- flask
- flask-cors

## Frontend
### Windows
eseguire il seguente comando in terminale nella root del progetto:
```
startFront.bat
```
### Linux / MacOS
eseguire il seguente comando in terminale nella root del progetto:
```
chmod +x startFront.sh
./startFront.sh
```
#### Spiegazione del comando:
Il comando `startFront.bat` / `startFront.sh` esegue i seguenti comandi:
1. cd nella directory `front`
2. `npm install` per installare le dipendenze del progetto
3. `npm run dev` per avviare il server di sviluppo del frontend del progetto.

Una volta avviato il server di sviluppo del frontend, sarà possibile accedere al progetto tramite il browser all'indirizzo `http://localhost:3039`, come anche indicato nel terminale.