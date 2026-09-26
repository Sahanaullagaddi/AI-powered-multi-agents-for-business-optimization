import os
from sqlalchemy import create_engine, Column, Integer, String, JSON, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Attempt connection to DATABASE_URL; fallback to SQLite if unreachable
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./medguard.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def create_resilient_engine():
    global DATABASE_URL
    target_url = DATABASE_URL
    try:
        if "postgresql" in target_url:
            eng = create_engine(target_url, connect_args={"connect_timeout": 3}, pool_pre_ping=True, pool_recycle=300)
        else:
            eng = create_engine(target_url, connect_args={"check_same_thread": False})
        with eng.connect() as conn:
            pass
        print(f"Connected to database successfully: {target_url.split('@')[-1] if '@' in target_url else target_url}")
        return eng
    except Exception as e:
        print(f"Warning: Could not connect to {target_url} ({e}). Falling back to local SQLite.")
        sqlite_url = "sqlite:///./medguard.db"
        DATABASE_URL = sqlite_url
        return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = create_resilient_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PredictionLog(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    drugs = Column(JSON) # e.g. ["Aspirin", "Warfarin"]
    severity = Column(String) # Major, Moderate, Minor
    explanation = Column(String, nullable=True) # Full AI explanation
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    role = Column(String) # "user" or "ai"
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
