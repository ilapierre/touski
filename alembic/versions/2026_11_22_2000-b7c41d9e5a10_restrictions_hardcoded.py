"""restrictions codées en dur: users_restrictions et foods_restrictions

Revision ID: b7c41d9e5a10
Revises: 72f4f94376b4
Create Date: 2026-11-22 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7c41d9e5a10'
down_revision: Union[str, Sequence[str], None] = '72f4f94376b4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # L'ancienne table (aliment + note) est remplacée. Aucune donnée n'est conservée.
    op.drop_table('users_restrictions')
    op.create_table('users_restrictions',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('restriction', sa.String(length=32), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_users_restrictions_user_id_users'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_id', 'restriction', name=op.f('pk_users_restrictions'))
    )
    op.create_table('foods_restrictions',
    sa.Column('food_id', sa.Integer(), nullable=False),
    sa.Column('restriction', sa.String(length=32), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['food_id'], ['foods.id'], name=op.f('fk_foods_restrictions_food_id_foods'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('food_id', 'restriction', name=op.f('pk_foods_restrictions'))
    )
    with op.batch_alter_table('foods', schema=None) as batch_op:
        batch_op.drop_column('allergens')


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('foods', schema=None) as batch_op:
        batch_op.add_column(sa.Column('allergens', sa.JSON(), nullable=True))

    op.drop_table('foods_restrictions')
    op.drop_table('users_restrictions')
    op.create_table('users_restrictions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('food_id', sa.Integer(), nullable=False),
    sa.Column('note', sa.String(length=50), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['food_id'], ['foods.id'], name=op.f('fk_users_restrictions_food_id_foods')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_users_restrictions_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users_restrictions'))
    )
