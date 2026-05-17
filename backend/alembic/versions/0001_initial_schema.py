"""Initial schema

Revision ID: 0001
Revises:
Create Date: 2026-01-01 00:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enums
    user_role = postgresql.ENUM(
        "super_admin", "plant_manager", "castx_operator", "eaf_operator", "dri_operator",
        name="user_role",
    )
    microapp_status = postgresql.ENUM(
        "active", "beta", "dev", "disabled",
        name="microapp_status",
    )
    datasource_type = postgresql.ENUM(
        "iba", "l2", "rest", "opc_ua", "mqtt", "sql",
        name="datasource_type",
    )
    datasource_status = postgresql.ENUM(
        "connected", "disconnected", "error", "untested",
        name="datasource_status",
    )
    user_role.create(op.get_bind(), checkfirst=True)
    microapp_status.create(op.get_bind(), checkfirst=True)
    datasource_type.create(op.get_bind(), checkfirst=True)
    datasource_status.create(op.get_bind(), checkfirst=True)

    # users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("hashed_password", sa.String(1024), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("initials", sa.String(4), nullable=False),
        sa.Column("color", sa.String(7), nullable=False),
        sa.Column("role", sa.Enum("super_admin", "plant_manager", "castx_operator",
                                  "eaf_operator", "dri_operator", name="user_role",
                                  create_type=False), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # user_sessions
    op.create_table(
        "user_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("token_hash", sa.String(64), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_sessions_user_id", "user_sessions", ["user_id"])
    op.create_index("ix_user_sessions_token_hash", "user_sessions", ["token_hash"], unique=True)

    # microapps
    op.create_table(
        "microapps",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("tagline", sa.String(512), nullable=False),
        sa.Column("version", sa.String(32), nullable=False),
        sa.Column("vendor", sa.String(255), nullable=False),
        sa.Column("icon", sa.String(255), nullable=False),
        sa.Column("color", sa.String(7), nullable=False),
        sa.Column("mount_key", sa.String(64), nullable=False),
        sa.Column("status", sa.Enum("active", "beta", "dev", "disabled",
                                    name="microapp_status", create_type=False), nullable=False),
        sa.Column("stage", sa.String(64), nullable=False),
        sa.Column("health_pct", sa.Integer(), nullable=False),
        sa.Column("instances", sa.Integer(), nullable=False),
        sa.Column("manifest_url", sa.String(2048), nullable=True),
        sa.Column("deployed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("mount_key"),
    )

    # microapp_roles
    op.create_table(
        "microapp_roles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("microapp_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("role", sa.Enum("super_admin", "plant_manager", "castx_operator",
                                  "eaf_operator", "dri_operator", name="user_role",
                                  create_type=False), nullable=False),
        sa.ForeignKeyConstraint(["microapp_id"], ["microapps.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_microapp_roles_microapp_id", "microapp_roles", ["microapp_id"])

    # data_sources
    op.create_table(
        "data_sources",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("type", sa.Enum("iba", "l2", "rest", "opc_ua", "mqtt", "sql",
                                  name="datasource_type", create_type=False), nullable=False),
        sa.Column("host", sa.String(255), nullable=False),
        sa.Column("port", sa.Integer(), nullable=True),
        sa.Column("username", sa.String(255), nullable=True),
        sa.Column("password_enc", sa.Text(), nullable=True),
        sa.Column("connection_mode", sa.String(64), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("last_tested_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.Enum("connected", "disconnected", "error", "untested",
                                    name="datasource_status", create_type=False), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # audit_logs
    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("action", sa.String(128), nullable=False),
        sa.Column("resource_type", sa.String(128), nullable=False),
        sa.Column("resource_id", sa.String(255), nullable=True),
        sa.Column("detail", sa.Text(), nullable=True),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_audit_logs_user_id", "audit_logs", ["user_id"])


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("data_sources")
    op.drop_table("microapp_roles")
    op.drop_table("microapps")
    op.drop_table("user_sessions")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS datasource_status")
    op.execute("DROP TYPE IF EXISTS datasource_type")
    op.execute("DROP TYPE IF EXISTS microapp_status")
    op.execute("DROP TYPE IF EXISTS user_role")
