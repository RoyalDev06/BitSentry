from sqlalchemy import select
from app.models import Permission, Role, User
from app.security import hash_password
from app.config import settings

PERMISSIONS = [
    "admin:all", "users:write", "bitcoin:read", "bitcoin:write", "transactions:read",
    "risk:read", "alerts:read", "alerts:write", "cases:read", "cases:write",
    "addresses:read", "addresses:write", "wallets:read", "wallets:write", "audit:read",
]

ROLE_PERMISSIONS = {
    "admin": PERMISSIONS,
    "analyst": ["bitcoin:read", "transactions:read", "risk:read", "alerts:read", "alerts:write", "cases:read", "cases:write", "addresses:read", "wallets:read"],
}


def seed_auth(db):
    permissions = {}
    for code in PERMISSIONS:
        permission = db.scalar(select(Permission).where(Permission.code == code))
        if permission is None:
            permission = Permission(code=code)
            db.add(permission)
            db.flush()
        permissions[code] = permission

    roles = {}
    for role_name, codes in ROLE_PERMISSIONS.items():
        role = db.scalar(select(Role).where(Role.name == role_name))
        if role is None:
            role = Role(name=role_name)
            db.add(role)
            db.flush()
        role.permissions = [permissions[code] for code in codes]
        roles[role_name] = role

    email = settings.admin_email.lower()
    admin = db.scalar(select(User).where(User.email == email))
    if admin is None:
        admin = User(email=email, full_name="BitSentry Admin", password_hash=hash_password(settings.admin_password))
        admin.roles.append(roles["admin"])
        db.add(admin)
    db.commit()
