import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

print("Loading dataset...")

df = pd.read_csv("db_drug_interactions.csv")

# rename columns
df = df.rename(columns={
    "Drug 1": "drug1",
    "Drug 2": "drug2",
    "Interaction Description": "description"
})

# create simple severity classification
def classify_severity(text):
    text = text.lower()
    if "contraindicated" in text or "fatal" in text or "life-threatening" in text:
        return "Major"
    elif "increase" in text or "decrease" in text or "risk" in text:
        return "Moderate"
    else:
        return "Minor"

df["severity"] = df["description"].apply(classify_severity)

# keep only needed columns
df = df[["drug1", "drug2", "severity"]]

# reduce dataset size to avoid memory crash
df = df.sample(20000, random_state=42)

print("Encoding data...")

le1 = LabelEncoder()
le2 = LabelEncoder()
le3 = LabelEncoder()

df['drug1'] = le1.fit_transform(df['drug1'])
df['drug2'] = le2.fit_transform(df['drug2'])
df['severity'] = le3.fit_transform(df['severity'])

X = df[['drug1','drug2']]
y = df['severity']

print("Training smaller model...")

model = RandomForestClassifier(n_estimators=10, max_depth=10)
model.fit(X,y)

print("Saving model...")

joblib.dump(model,"ddi_model.pkl")
joblib.dump(le1,"le1.pkl")
joblib.dump(le2,"le2.pkl")
joblib.dump(le3,"le3.pkl")

print("✅ SUCCESS: MODEL TRAINED WITHOUT MEMORY ERROR")