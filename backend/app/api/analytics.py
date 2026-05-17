from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["analytics"])


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────


def _jitter(base: float, pct: float = 0.02) -> float:
    """Return *base* ± pct% random noise."""
    return round(base * (1 + random.uniform(-pct, pct)), 2)


def _time_series(
    n: int,
    interval_seconds: int = 60,
    base: float = 100.0,
    pct: float = 0.04,
) -> List[Dict[str, Any]]:
    """Generate *n* timestamped value points ending at now."""
    now = datetime.now(tz=timezone.utc)
    series = []
    val = base
    for i in range(n, 0, -1):
        ts = now - timedelta(seconds=interval_seconds * i)
        val = _jitter(val, pct)
        series.append({"ts": ts.isoformat(), "value": round(val, 2)})
    return series


# ──────────────────────────────────────────────────────────────────────────────
# KPI strip
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/kpis")
async def get_kpis(
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Live KPI strip values for the dashboard header."""
    return {
        "yield_rate": _jitter(94.7),                # %
        "eaf_energy_kwh_ton": _jitter(385.2, 0.03),  # kWh/t
        "metallization_pct": _jitter(92.4),          # %
        "tundish_temp": _jitter(1548.0, 0.01),       # °C
        "tap_to_tap_min": _jitter(54.3, 0.04),       # min
        "updated_at": datetime.now(tz=timezone.utc).isoformat(),
    }


# ──────────────────────────────────────────────────────────────────────────────
# CastX snapshot
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/castx/snapshot")
async def get_castx_snapshot(
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Per-strand mould level, cast speed and tundish temperature snapshot."""
    strands = []
    for strand_no in range(1, 7):
        strands.append({
            "strand": strand_no,
            "mould_level_mm": _jitter(120.0, 0.05),     # mm (target ~120)
            "cast_speed_mpm": _jitter(1.45, 0.06),       # m/min
            "tundish_temp_c": _jitter(1548.0, 0.01),     # °C
            "breakout_risk": random.choice(["low", "low", "low", "medium"]),
        })

    return {
        "strands": strands,
        "heat_id": f"H{random.randint(24100, 24199):05d}",
        "grade": random.choice(["SAE1008", "SAE1018", "SAE1035"]),
        "tundish_weight_t": _jitter(28.5, 0.04),
        "total_cast_length_m": _jitter(1248.6, 0.01),
        "updated_at": datetime.now(tz=timezone.utc).isoformat(),
    }


# ──────────────────────────────────────────────────────────────────────────────
# EAF energy
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/eaf/energy")
async def get_eaf_energy(
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """EAF power curve, arc stability and electrode wear data."""
    power_curve = _time_series(n=20, interval_seconds=90, base=68.5, pct=0.06)
    electrode_wear = {
        "phase_a_mm": _jitter(18.3, 0.08),
        "phase_b_mm": _jitter(17.9, 0.08),
        "phase_c_mm": _jitter(18.6, 0.08),
    }
    return {
        "power_curve_mw": power_curve,
        "arc_stability_pct": _jitter(96.2, 0.02),
        "electrode_wear": electrode_wear,
        "current_power_mw": _jitter(68.5, 0.05),
        "tap_temperature_c": _jitter(1612.0, 0.01),
        "heat_number": f"EAF-{random.randint(8400, 8500)}",
        "tap_to_tap_elapsed_min": _jitter(38.2, 0.10),
        "updated_at": datetime.now(tz=timezone.utc).isoformat(),
    }


# ──────────────────────────────────────────────────────────────────────────────
# DRI gas
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/dri/gas")
async def get_dri_gas(
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """DRI/DRP reactor gas flow, metallization and zone temperatures."""
    gas_flow = _time_series(n=20, interval_seconds=120, base=62400, pct=0.03)
    zone_temps = {
        "reduction_zone_c": _jitter(920.0, 0.02),
        "transition_zone_c": _jitter(740.0, 0.03),
        "cooling_zone_c": _jitter(55.0, 0.05),
    }
    return {
        "gas_flow_nm3h": gas_flow,
        "metallization_pct": _jitter(92.4, 0.02),
        "zone_temperatures": zone_temps,
        "h2_pct": _jitter(55.3, 0.03),
        "co_pct": _jitter(34.7, 0.03),
        "ch4_pct": _jitter(4.2, 0.05),
        "production_rate_t_h": _jitter(130.5, 0.03),
        "updated_at": datetime.now(tz=timezone.utc).isoformat(),
    }


# ──────────────────────────────────────────────────────────────────────────────
# Alerts
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/alerts")
async def get_alerts(
    current_user: User = Depends(get_current_user),
) -> List[Dict[str, Any]]:
    """Return the current active alert list."""
    now = datetime.now(tz=timezone.utc)

    alerts = [
        {
            "id": "alrt-001",
            "severity": "warning",
            "module": "CastX",
            "message": "Strand 3 mould level oscillation exceeds ±8 mm threshold",
            "timestamp": (now - timedelta(minutes=4)).isoformat(),
            "acknowledged": False,
        },
        {
            "id": "alrt-002",
            "severity": "info",
            "module": "EAF",
            "message": "Electrode C consumption rate is 12% above baseline",
            "timestamp": (now - timedelta(minutes=17)).isoformat(),
            "acknowledged": False,
        },
        {
            "id": "alrt-003",
            "severity": "critical",
            "module": "DRI",
            "message": "Cooling zone outlet temperature exceeded 65 °C — check cooling water flow",
            "timestamp": (now - timedelta(minutes=2)).isoformat(),
            "acknowledged": False,
        },
        {
            "id": "alrt-004",
            "severity": "warning",
            "module": "CastX",
            "message": "Tundish weight below 22 t — consider opening ladle slide gate",
            "timestamp": (now - timedelta(minutes=9)).isoformat(),
            "acknowledged": True,
        },
        {
            "id": "alrt-005",
            "severity": "info",
            "module": "EAF",
            "message": "Heat #EAF-8471 tap-to-tap time approaching 60-minute SLA",
            "timestamp": (now - timedelta(minutes=22)).isoformat(),
            "acknowledged": False,
        },
        {
            "id": "alrt-006",
            "severity": "warning",
            "module": "DRI",
            "message": "H₂/CO ratio drifted to 1.65 — adjust reformer set-point",
            "timestamp": (now - timedelta(minutes=35)).isoformat(),
            "acknowledged": True,
        },
        {
            "id": "alrt-007",
            "severity": "info",
            "module": "System",
            "message": "IBA Historian data source latency is 340 ms — above 200 ms warning threshold",
            "timestamp": (now - timedelta(minutes=51)).isoformat(),
            "acknowledged": False,
        },
    ]

    return alerts
