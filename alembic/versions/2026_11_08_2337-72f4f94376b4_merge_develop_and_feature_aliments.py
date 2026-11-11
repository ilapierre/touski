"""merge develop and feature/aliments

Revision ID: 72f4f94376b4
Revises: 6f478a1f17e2, a369353a1f1d
Create Date: 2026-11-08 23:37:35.012405

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '72f4f94376b4'
down_revision: Union[str, Sequence[str], None] = ('6f478a1f17e2', 'a369353a1f1d')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
