"""empty message

Revision ID: 1505acbbdf1f
Revises: e6687aa20b56
Create Date: 2026-10-28 11:32:18.986816

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1505acbbdf1f'
down_revision: Union[str, Sequence[str], None] = 'e6687aa20b56'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('foods', sa.Column('per', sa.String(length=10), nullable=True))
    op.add_column('foods', sa.Column('kcal', sa.Integer(), nullable=True))
    op.add_column('foods', sa.Column('fat', sa.Integer(), nullable=True))
    op.add_column('foods', sa.Column('proteins', sa.Integer(), nullable=True))
    op.add_column('foods', sa.Column('carbohydrates', sa.Integer(), nullable=True))
    # SQLite can't ALTER TABLE ADD CONSTRAINT, so use batch mode (table recreate)
    with op.batch_alter_table('users_restrictions') as batch_op:
        batch_op.create_foreign_key('fk_users_restrictions_user_id', 'users', ['user_id'], ['id'])
        batch_op.create_foreign_key('fk_users_restrictions_food_id', 'foods', ['food_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('users_restrictions') as batch_op:
        batch_op.drop_constraint('fk_users_restrictions_food_id', type_='foreignkey')
        batch_op.drop_constraint('fk_users_restrictions_user_id', type_='foreignkey')
    op.drop_column('foods', 'carbohydrates')
    op.drop_column('foods', 'proteins')
    op.drop_column('foods', 'fat')
    op.drop_column('foods', 'kcal')
    op.drop_column('foods', 'per')
