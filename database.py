from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import os

DATABASE_URL = "sqlite:///./chaincompass.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class TransactionHistory(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_address = Column(String, index=True)
    from_chain_id = Column(Integer)
    to_chain_id = Column(Integer)
    from_token = Column(String)
    to_token = Column(String)
    from_amount = Column(String)
    to_amount = Column(String)
    tx_hash = Column(String, index=True)
    status = Column(String, default="pending")  # pending, completed, failed
    gas_used = Column(Float, nullable=True)
    fees_paid = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    confirmed_at = Column(DateTime, nullable=True)
    
class UserSession(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, unique=True, index=True)
    nonce = Column(String)
    is_authenticated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
