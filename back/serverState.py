import os
import kagglehub
import numpy as np
import pandas as pd
from sklearn.discriminant_analysis import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC


class ModelsEnum:
    Regression = "Regression"
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
    return WineQualities.astype({"color": "int8"})

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

class ServerState:
    modelName = ModelsEnum.Regression
    modelChosen = None  
    _instance = None
    WineQualities = None


    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ServerState, cls).__new__(cls)
            # import the dataset only once
            cls._instance.WineQualities = getDataSetAndPrepareIt()
            cls._instance._initializeLinearRegression()
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
        self.modelName = newModelName

    def get_model(self):
        return self.modelChosen
    
    def handlePrediction(self,data):
        if self.modelName is ModelsEnum.Null:
            raise ValueError("Nessun modello selezionato")
        return self.modelChosen.predict(data)
    

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
    
    def _initializeSVMBinary(self):
        # Prepare the data
        (train_X_scaled, test_X_scaled, 
         train_y_binary, test_y_binary, 
         train_y_multi, test_y_multi, 
         train_y_continuous, test_y_continuous) = _prepare_data(self.WineQualities)

        svm_cls = SVC(kernel='rbf', random_state=42, probability=True,class_weight='balanced')
        svm_cls.fit(train_X_scaled, train_y_binary)

    def _initializeSVMMulti(self):
        # Prepare the data
        (train_X_scaled, test_X_scaled, 
         train_y_binary, test_y_binary, 
         train_y_multi, test_y_multi, 
         train_y_continuous, test_y_continuous) = _prepare_data(self.WineQualities)

        svm_cls = SVC(kernel='rbf', random_state=42, probability=True,class_weight='balanced')
        svm_cls.fit(train_X_scaled, train_y_multi)


    def _initializeLinearRegression(self):
        # Initialize the linear regression model
        from sklearn.linear_model import LinearRegression
        self.modelChosen = LinearRegression()
        # Prepare the data
        (train_X_scaled, test_X_scaled, 
         train_y_binary, test_y_binary, 
         train_y_multi, test_y_multi, 
         train_y_continuous, test_y_continuous) = _prepare_data(self.WineQualities)
        
        self.modelChosen.fit(train_X_scaled, train_y_continuous)