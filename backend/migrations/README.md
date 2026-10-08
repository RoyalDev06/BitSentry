# Database migrations

The testing MVP uses SQLAlchemy `Base.metadata.create_all()` during startup so the team can reach integration testing quickly.

Before production:

1. Add Alembic.
2. Generate an initial migration from the SQLAlchemy models.
3. Stop using `create_all()` in application startup.
4. Run migrations as a deployment step.
5. Review indexes, foreign-key cascade behavior, and PostgreSQL JSON/enum choices before production.
