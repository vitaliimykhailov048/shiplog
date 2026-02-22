from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Shipment, ShipmentStatus, User
from ..schemas import (
    ShipmentCreate,
    ShipmentOut,
    ShipmentUpdate,
    StatsOut,
    Status,
)


router = APIRouter(prefix="/api/shipments", tags=["shipments"])


@router.get("", response_model=list[ShipmentOut])
def list_shipments(
    status_filter: Optional[Status] = Query(default=None, alias="status"),
    q: Optional[str] = Query(default=None, max_length=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(Shipment).filter(Shipment.owner_id == user.id)
    if status_filter:
        query = query.filter(Shipment.status == status_filter)
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(
            func.lower(Shipment.tracking_number).like(like)
            | func.lower(Shipment.destination).like(like)
            | func.lower(Shipment.origin).like(like)
        )
    return query.order_by(Shipment.created_at.desc()).all()


@router.get("/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = (
        db.query(Shipment.status, func.count(Shipment.id))
        .filter(Shipment.owner_id == user.id)
        .group_by(Shipment.status)
        .all()
    )
    counts = {s.value: 0 for s in ShipmentStatus}
    for s, c in rows:
        counts[s] = c
    return StatsOut(total=sum(counts.values()), **counts)


@router.post("", response_model=ShipmentOut, status_code=status.HTTP_201_CREATED)
def create_shipment(
    payload: ShipmentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    shipment = Shipment(owner_id=user.id, **payload.model_dump())
    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    return shipment


@router.get("/{shipment_id}", response_model=ShipmentOut)
def get_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    shipment = db.get(Shipment, shipment_id)
    if not shipment or shipment.owner_id != user.id:
        raise HTTPException(status_code=404, detail="not found")
    return shipment


@router.patch("/{shipment_id}", response_model=ShipmentOut)
def update_shipment(
    shipment_id: int,
    payload: ShipmentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    shipment = db.get(Shipment, shipment_id)
    if not shipment or shipment.owner_id != user.id:
        raise HTTPException(status_code=404, detail="not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(shipment, field, value)

    db.commit()
    db.refresh(shipment)
    return shipment


@router.delete("/{shipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    shipment = db.get(Shipment, shipment_id)
    if not shipment or shipment.owner_id != user.id:
        raise HTTPException(status_code=404, detail="not found")

    db.delete(shipment)
    db.commit()
    return None
