import os
import kagglehub
import numpy as np
import pandas as pd
from sklearn.discriminant_analysis import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC


class ModelsEnum:
    Regression = "LinearRegression"
    RandomForest = "RandomForest"
    SVMBinary = "SVMBinary"
    SVMMulti = "SVMMulti"
    Null = "None"

    def getTypes():
        return [
            ModelsEnum.Regression,
            ModelsEnum.RandomForest,
            ModelsEnum.SVMBinary,
            ModelsEnum.SVMMulti,
            ModelsEnum.Null,
        ]


def getDataSetAndPrepareIt():
    path = kagglehub.dataset_download("rajyellow46/wine-quality")
    csv_file = os.path.join(path, "winequalityN.csv")
    WineQualities = pd.read_csv(csv_file)
    WineQualities.rename(columns={"type" : "color"}, inplace=True)
    WineQualities["color"] = WineQualities["color"].map({"red": 1, "white": 0})
    WineQualities = WineQualities.astype({"color": "int8"})
    for col in WineQualities.columns:
        if WineQualities[col].isnull().any():
            # Ottiengo le righe con valori NaN per il colonna corrente
            nan_row = WineQualities[WineQualities[col].isnull()]
            for index, row in nan_row.iterrows():
                rowToMean = WineQualities[WineQualities['color'] == row['color']]
                rowToMean = rowToMean[rowToMean['quality'] == row['quality']]
                if not rowToMean.empty:
                    mean_value = rowToMean[col].mean()
                    WineQualities.at[index, col] = mean_value
                else:
                    exit(f"Nessun valore trovato per la colonna {col} con qualità {row['quality']} e colore {row['color']}")
    return WineQualities

def create_multiclass_class_names(data):
    """
    Crea le etichette per classificazione a 4 classi:
    0: Bianco Cattivo (quality < 7, color = 0)
    1: Bianco Buono (quality >= 7, color = 0) 
    2: Rosso Cattivo (quality < 7, color = 1)
    3: Rosso Buono (quality >= 7, color = 1)
    """
    class_names = []
    for _, row in data.iterrows():
        if row['color'] == 0 and row['quality'] < 7:
            class_names.append(0)
        elif row['color'] == 0 and row['quality'] >= 7:
            class_names.append(1)
        elif row['color'] == 1 and row['quality'] < 7:
            class_names.append(2)
        else:
            class_names.append(3)
    return np.array(class_names)

def _prepare_data(WineQualities):
    # 1. Features e variabili target
    X = WineQualities.drop(columns=['quality'])
    y_continuous = WineQualities['quality']
    y_binary = (y_continuous >= 7).astype(int)
    y_multi = create_multiclass_class_names(WineQualities)

    # 2. Divisione stratificata (usiamo y_binary per garantire bilanciamento)
    train_X, test_X, train_y_binary, test_y_binary = train_test_split(
        X, y_binary, test_size=0.15, random_state=42, stratify=y_binary
    )

    # 3. Indici per assegnare gli altri target
    train_indices = train_X.index
    test_indices = test_X.index

    train_y_multi = y_multi[train_indices]
    test_y_multi = y_multi[test_indices]

    train_y_continuous = y_continuous.iloc[train_indices]
    test_y_continuous = y_continuous.iloc[test_indices]

    # 5. Standardizzazione (necessaria per modelli sensibili alla scala)
    scaler = StandardScaler()
    train_X_scaled = scaler.fit_transform(train_X)
    test_X_scaled = scaler.transform(test_X)
    return (train_X_scaled, test_X_scaled, 
            train_y_binary, test_y_binary, 
            train_y_multi, test_y_multi, 
            train_y_continuous, test_y_continuous)

def isClassification(modelName):
    return modelName in [ModelsEnum.SVMBinary, ModelsEnum.SVMMulti]

class ServerState:
    modelName = ModelsEnum.Regression
    modelChosen = None  
    _instance = None
    WineQualities = None
    scaler = None  # Aggiungi un attributo per il scaler
    genericStatistics = None
    specificStatistics = None
    history = []

    def reset(self):
        self.modelName = ModelsEnum.Regression
        self._initializeLinearRegression()
    
    def _genericStatistics(self):
        if self.genericStatistics is None:
            self.genericStatistics = {
                0: {
                    "name": "Wine Quality distribution",
                    "good": self.WineQualities[self.WineQualities['quality'] >= 7].shape[0],
                    "bad":  self.WineQualities[self.WineQualities['quality'] < 7].shape[0],
                },
                1: {
                    "name": "Wine color distribution",
                    "red": self.WineQualities[self.WineQualities['color'] == 1].shape[0],
                    "white": self.WineQualities[self.WineQualities['color'] == 0].shape[0],
                },
                2: {
                    "name" : "Red and white wine distribution based on quality (>=7)",
                    "red": self.WineQualities[(self.WineQualities['color'] == 1) & (self.WineQualities['quality'] >= 7)].shape[0],
                    "white": self.WineQualities[(self.WineQualities['color'] == 0) & (self.WineQualities['quality'] >= 7)].shape[0],
                },
                3: {
                    "name" : "Red and white wine distribution based on quality (<7)",
                    "red": self.WineQualities[(self.WineQualities['color'] == 1) & (self.WineQualities['quality'] < 7)].shape[0],
                    "white": self.WineQualities[(self.WineQualities['color'] == 0) & (self.WineQualities['quality'] < 7)].shape[0],
                }
            }
     
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ServerState, cls).__new__(cls)
            # import the dataset only once
            cls._instance.WineQualities = getDataSetAndPrepareIt()
            cls._instance._genericStatistics()
            cls._instance._initializeLinearRegression()
            scaler = StandardScaler()
            cls._instance.scaler = scaler.fit(cls._instance.WineQualities.drop(columns=['quality']))
        return cls._instance
        
    def set_model(self, newModelName):
        # if modelChosen is not None, remove it from memory
        if self.modelName is not ModelsEnum.Null:
            del self.modelChosen
        match newModelName:
            case ModelsEnum.Regression:
                self._initializeLinearRegression()
            case ModelsEnum.RandomForest:
                self._initializeRandomForest()
            case ModelsEnum.SVMBinary:
                self._initializeSVMBinary()
            case ModelsEnum.SVMMulti:
                self._initializeSVMMulti()
            case _:
                raise ValueError("Modello non supportato")

    def get_model(self):
        return self.modelChosen
    
    def handlePrediction(self, data):
        if self.modelName is ModelsEnum.Null:
            raise ValueError("Nessun modello selezionato")

        import pandas as pd

        rename_map = {
            'fixed_acidity': 'fixed acidity',
            'volatile_acidity': 'volatile acidity',
            'citric_acid': 'citric acid',
            'residual_sugar': 'residual sugar',
            'chlorides': 'chlorides',
            'free_sulfur_dioxide': 'free sulfur dioxide',
            'total_sulfur_dioxide': 'total sulfur dioxide',
            'density': 'density',
            'pH': 'pH',
            'sulphates': 'sulphates',
            'alcohol': 'alcohol',
            'color': 'color'
        }

        converted = {rename_map[k]: v for k, v in data.items() if k in rename_map}
        ordered_data = {name: converted.get(name, 0) for name in self.feature_names}
        df = pd.DataFrame([ordered_data])
        input_scaled = self.scaler.transform(df)

        # Predizione
        prediction = self.modelChosen.predict(input_scaled)
        if isClassification(self.modelName):
            # Se il modello è di classificazione, restituisci le probabilità
            if self.modelName == ModelsEnum.SVMMulti:
                probabilities = self.modelChosen.predict_proba(input_scaled)
                # Converti le probabilità in un dizionario con le etichette
                class_labels = [0, 1, 2, 3]
                prediction = {label: prob for label, prob in zip(class_labels, probabilities[0])}
            else:
                probabilities = self.modelChosen.predict_proba(input_scaled)
                # Converti le probabilità in un dizionario con le etichette
                class_labels = [0, 1]
                prediction = {label: prob for label, prob in zip(class_labels, probabilities[0])}
            self.history.append({
                "model": self.modelName,
                "date": pd.Timestamp.now().isoformat(),
                "prediction": prediction
            })
            return prediction
        else:       
            self.history.append({
                "model": self.modelName,
                "date": pd.Timestamp.now().isoformat(),
                "prediction": prediction.tolist()
            })
            return prediction.tolist()
    

    def _initializeRandomForest(self):
        # Initialize the Random Forest model
        from sklearn.ensemble import RandomForestRegressor
        self.modelChosen = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
        # Prepare the data
        (train_X_scaled, test_X_scaled, 
         train_y_binary, test_y_binary, 
         train_y_multi, test_y_multi, 
         train_y_continuous, test_y_continuous) = _prepare_data(self.WineQualities)
        self.modelChosen.fit(train_X_scaled, train_y_continuous)
        self.modelName = ModelsEnum.RandomForest
        self.specificStatistics = {
            "feature_importances": dict(zip(self.WineQualities.drop(columns=['quality']).columns, self.modelChosen.feature_importances_)),
            "r2_score": self.modelChosen.score(test_X_scaled, test_y_continuous),
            "mean_squared_error": np.mean((self.modelChosen.predict(test_X_scaled) - test_y_continuous) ** 2),
            "mean_absolute_error": np.mean(np.abs(self.modelChosen.predict(test_X_scaled) - test_y_continuous)),
        }
    
    def _initializeSVMBinary(self):
        # Prepare the data
        (train_X_scaled, test_X_scaled, 
         train_y_binary, test_y_binary, 
         train_y_multi, test_y_multi, 
         train_y_continuous, test_y_continuous) = _prepare_data(self.WineQualities)

        self.modelChosen = SVC(kernel='rbf', random_state=42, probability=True,class_weight='balanced')
        self.modelChosen.fit(train_X_scaled, train_y_binary)
        self.modelName = ModelsEnum.SVMBinary
        self.specificStatistics = {
            "r2_score": self.modelChosen.score(test_X_scaled, test_y_binary),
            "mean_squared_error": np.mean((self.modelChosen.predict(test_X_scaled) - test_y_binary) ** 2),
            "mean_absolute_error": np.mean(np.abs(self.modelChosen.predict(test_X_scaled) - test_y_binary)),
        }

    def _initializeSVMMulti(self):
        # Prepare the data
        (train_X_scaled, test_X_scaled, 
         train_y_binary, test_y_binary, 
         train_y_multi, test_y_multi, 
         train_y_continuous, test_y_continuous) = _prepare_data(self.WineQualities)

        self.modelChosen = SVC(kernel='rbf', random_state=42, probability=True,class_weight='balanced')
        self.modelChosen.fit(train_X_scaled, train_y_multi)
        self.modelName = ModelsEnum.SVMMulti
        self.specificStatistics = {
            "r2_score": self.modelChosen.score(test_X_scaled, test_y_multi),
            "mean_squared_error": np.mean((self.modelChosen.predict(test_X_scaled) - test_y_multi) ** 2),
            "mean_absolute_error": np.mean(np.abs(self.modelChosen.predict(test_X_scaled) - test_y_multi)),
        }


    def _initializeLinearRegression(self):
        # Initialize the linear regression model
        from sklearn.linear_model import LinearRegression
        self.modelChosen = LinearRegression()
        # Prepare the data
        (train_X_scaled, test_X_scaled, 
         train_y_binary, test_y_binary, 
         train_y_multi, test_y_multi, 
         train_y_continuous, test_y_continuous) = _prepare_data(self.WineQualities)
        
        self.feature_names = self.WineQualities.drop(columns=['quality']).columns.tolist()
        self.modelChosen.fit(train_X_scaled, train_y_continuous)
        self.modelName = ModelsEnum.Regression
        self.specificStatistics = {
            "coefficients": dict(zip(self.feature_names, self.modelChosen.coef_)),
            "r2_score": self.modelChosen.score(test_X_scaled, test_y_continuous),
            "mean_squared_error": np.mean((self.modelChosen.predict(test_X_scaled) - test_y_continuous) ** 2),
            "mean_absolute_error": np.mean(np.abs(self.modelChosen.predict(test_X_scaled) - test_y_continuous)),
        }