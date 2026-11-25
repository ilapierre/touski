"""merge restrictions et frigo

Revision ID: ede395177da9
Revises: b7c41d9e5a10, a3647ad5d40b
Create Date: 2026-11-25 10:44:17.885173

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ede395177da9'
down_revision: Union[str, Sequence[str], None] = ('b7c41d9e5a10', 'a3647ad5d40b')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
