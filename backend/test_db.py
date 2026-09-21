from database import engine, PredictionLog, ChatHistory
from sqlalchemy import inspect
from sqlalchemy.orm import Session

print("Testing database connection to Neon PostgreSQL...")

try:
    # Check tables
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Found tables in DB:", tables)
    
    if "predictions" in tables and "chat_history" in tables:
        print("SUCCESS! All required tables are created.")
    else:
        print("WARNING: Tables might not be created yet.")
        
    # Check row counts
    with Session(engine) as session:
        pred_count = session.query(PredictionLog).count()
        chat_count = session.query(ChatHistory).count()
        print(f"Current Predictions in DB: {pred_count}")
        print(f"Current Chat Messages in DB: {chat_count}")
        
except Exception as e:
    print("Database Connection Error:", e)
