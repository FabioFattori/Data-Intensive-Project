export interface SingleModel{
    nameToDisplay: string;
    nameToSend: string;
}

export const ModelTypes: { [key: string]: SingleModel } = {
    LinearRegression: {
        nameToDisplay: 'Linear Regression',
        nameToSend: 'LinearRegression',
    },
    RandomForest: {
        nameToDisplay: 'Random Forest',
        nameToSend: 'RandomForest',
    },
    SVMBinary: {
        nameToDisplay: 'SVM Binary',
        nameToSend: 'SVMBinary',
    },
    SVMMulti: {
        nameToDisplay: 'SVM Multiclass',
        nameToSend: 'SVMMulti',
    },
};