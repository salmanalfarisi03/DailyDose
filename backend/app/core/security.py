"""Security utilities for DailyDose AI: password hashing and verification."""

import hashlib
import hmac
import secrets
from typing import Tuple

ITERATIONS = 100_000
HASH_ALGORITHM = "sha256"


def hash_password(password: str) -> str:
    """Hash a plain text password using PBKDF2-HMAC-SHA256 with a unique cryptographic salt."""
    salt = secrets.token_hex(16)
    pw_hash = hashlib.pbkdf2_hmac(
        HASH_ALGORITHM,
        password.encode("utf-8"),
        salt.encode("utf-8"),
        ITERATIONS,
    ).hex()
    return f"pbkdf2_sha256${ITERATIONS}${salt}${pw_hash}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a stored PBKDF2 hash using timing-safe comparison."""
    try:
        parts = hashed_password.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt = parts[2]
        expected_hash = parts[3]

        calculated_hash = hashlib.pbkdf2_hmac(
            HASH_ALGORITHM,
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            iterations,
        ).hex()

        return hmac.compare_digest(calculated_hash, expected_hash)
    except Exception:
        return False


def generate_session_token() -> str:
    """Generate a secure cryptographic session token."""
    return f"dd_{secrets.token_urlsafe(32)}"
