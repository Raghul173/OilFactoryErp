"""
Oil Factory Machine Learning Engine
===================================
Algorithm : Ordinary Least Squares (OLS) Linear Regression
Libraries : scikit-learn, pandas, numpy
Dataset   : ml/dataset.csv

Mathematical Formula:
    y = m * x + c
Where:
    y = Extracted Oil Output (Liters)
    x = Raw Seed Input Weight (Kilograms)
    m = Slope (Extraction recovery efficiency)
    c = Intercept (Machine calibration constant)
"""

import os
import sys
import argparse
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

# Path to the training dataset CSV
DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset.csv")


def load_dataset():
    """Loads historical batch extraction dataset from CSV."""
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset file not found at: {DATASET_PATH}")
    return pd.read_csv(DATASET_PATH)


def train_model(oil_type="Groundnut Oil"):
    """
    Trains a Scikit-Learn Linear Regression model for the specified oil variety.
    Returns the trained model, metrics, and regression parameters.
    """
    df = load_dataset()
    
    # Filter dataset for selected oil type
    filtered_df = df[df["oil_type"].str.lower() == oil_type.lower()]
    if filtered_df.empty:
        # Fallback to Groundnut Oil if variety name not exact
        filtered_df = df[df["oil_type"] == "Groundnut Oil"]
        oil_type = "Groundnut Oil"

    X = filtered_df[["raw_seed_kg"]].values  # Features (Seed Weight)
    y = filtered_df["extracted_liters"].values  # Target (Extracted Oil)

    # Initialize and fit Linear Regression model
    model = LinearRegression()
    model.fit(X, y)

    # Predictions on training data to compute metrics
    y_pred = model.predict(X)

    slope = float(model.coef_[0])
    intercept = float(model.intercept_)
    r2 = float(r2_score(y, y_pred))
    mae = float(mean_absolute_error(y, y_pred))

    return {
        "model": model,
        "oil_type": oil_type,
        "slope": slope,
        "intercept": intercept,
        "r2_score": r2,
        "mae": mae,
        "dataset_size": len(filtered_df),
    }


def predict_yield(oil_type="Groundnut Oil", seed_kg=2000.0):
    """
    Predicts oil output in liters for a given seed weight.
    """
    trained = train_model(oil_type)
    model = trained["model"]

    target_seed = max(1.0, float(seed_kg))
    prediction = float(model.predict(np.array([[target_seed]]))[0])
    predicted_liters = max(1, round(prediction))

    recovery_pct = round((predicted_liters / target_seed) * 100, 2)
    sign = "+" if trained["intercept"] >= 0 else "-"
    formula = f"Yield = ({trained['slope']:.3f} * SeedKg) {sign} {abs(trained['intercept']):.1f}"

    return {
        "oil_type": trained["oil_type"],
        "input_seed_kg": target_seed,
        "predicted_liters": predicted_liters,
        "recovery_percentage": f"{recovery_pct}%",
        "formula": formula,
        "slope": round(trained["slope"], 4),
        "intercept": round(trained["intercept"], 2),
        "r2_score": round(trained["r2_score"], 4),
        "mae": round(trained["mae"], 2),
        "training_samples": trained["dataset_size"],
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    parser = argparse.ArgumentParser(description="Train and run Oil Factory Linear Regression model")
    parser.add_argument("--oil", type=str, default="Groundnut Oil", help="Oil Variety (e.g., Groundnut Oil)")
    parser.add_argument("--seeds", type=float, default=2000.0, help="Raw Seed Weight in Kilograms")
    args = parser.parse_args()

    result = predict_yield(args.oil, args.seeds)

    print("=" * 65)
    print("      OIL FACTORY MACHINE LEARNING YIELD PREDICTION SYSTEM      ")
    print("      Model: Scikit-Learn LinearRegression (Supervised ML)      ")
    print("=" * 65)
    print(f"  Oil Variety        : {result['oil_type']}")
    print(f"  Raw Seed Input     : {result['input_seed_kg']} kg")
    print(f"  Training Batches   : {result['training_samples']} historical extraction logs")
    print("-" * 65)
    print(f"  -> PREDICTED YIELD : {result['predicted_liters']} Liters")
    print(f"  -> Extraction Rate : {result['recovery_percentage']}")
    print(f"  -> Model Equation  : {result['formula']}")
    print(f"  -> R2 Score (Fit)  : {result['r2_score']}")
    print(f"  -> Mean Abs Error  : +/-{result['mae']} Liters")
    print("=" * 65)


if __name__ == "__main__":
    main()
