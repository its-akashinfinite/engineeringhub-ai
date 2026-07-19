"""
EngineerHub AI — Database Schema (SQLModel)
------------------------------------------------------
Defines the relational model for the FastAPI backend, covering:
  - User accounts + persisted UI/dashboard state
  - Kanban-style project tracking
  - LeetCode profile stats + solve trajectory (for sparkline rendering)
  - Audio de-noising job history (waveform arrays + processing metadata)

SQLModel classes serve double duty here: with `table=True` they're both
the SQLAlchemy ORM table definition AND the Pydantic validation model —
so these same classes can be reused directly as FastAPI request/response
types if desired (though see the Read/Create variants at the bottom for
why you usually don't want to expose the table models directly over the API).

Run migrations / create tables via `init_db()` at the bottom of this file,
called once from your FastAPI app's startup event.
"""

from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, Relationship, SQLModel, create_engine


# --------------------------------------------------------------------------
# User
# --------------------------------------------------------------------------

class User(SQLModel, table=True):
    """
    Core account model. Also persists lightweight UI/dashboard state
    (CGPA figure, active theme) so the frontend can hydrate on load
    instead of relying purely on localStorage.
    """

    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str

    # Persisted UI/dashboard state — mirrors what Dashboard.jsx and
    # Settings.jsx currently hold in local component state only.
    current_cgpa: float = Field(default=8.42)
    current_theme: str = Field(default="dark")  # 'dark' | 'light'

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # --- Relationships (one user -> many projects, one profile, many jobs) ---
    projects: List["Project"] = Relationship(
        back_populates="owner",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    leetcode_profile: Optional["LeetCodeProfile"] = Relationship(
        back_populates="owner",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "uselist": False},
    )
    audio_jobs: List["AudioProcessingJob"] = Relationship(
        back_populates="owner",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


# --------------------------------------------------------------------------
# Projects (Kanban board — mirrors Projects.jsx's column/card model)
# --------------------------------------------------------------------------

class Project(SQLModel, table=True):
    """
    A single kanban card. `status` maps directly to the three columns
    rendered in Projects.jsx: 'todo' | 'inProgress' | 'completed'.
    """

    id: Optional[int] = Field(default=None, primary_key=True)

    title: str
    tag: str  # e.g. 'Signal Processing', 'Software', 'Hardware', 'Embedded'
    status: str = Field(default="todo")  # 'todo' | 'inProgress' | 'completed'
    is_bookmarked: bool = Field(default=False)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # --- Foreign key back to the owning user ---
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    owner: Optional[User] = Relationship(back_populates="projects")


# --------------------------------------------------------------------------
# LeetCode Tracker Profile
# --------------------------------------------------------------------------

class LeetCodeProfile(SQLModel, table=True):
    """
    Mirrors the shape returned by the /api/leetcode/{username} proxy
    endpoint. `solve_trajectory` persists a time-series so the frontend's
    sparkline can plot real historical progress instead of the synthetic
    eased curve LeetCodeTracker.jsx currently falls back to.

    solve_trajectory shape (JSON): a list of {date, total_solved} points,
    e.g. [{"date": "2026-07-01", "total_solved": 142}, ...] — populated by
    a scheduled job that snapshots stats periodically, not on every request.
    """

    id: Optional[int] = Field(default=None, primary_key=True)

    username: str = Field(unique=True, index=True)
    global_ranking: Optional[int] = None
    acceptance_rate: Optional[float] = None
    total_solved: int = Field(default=0)

    # Native JSON column — stored as a JSON blob, returned to FastAPI as a
    # plain Python list/dict, no manual serialization needed on either side.
    solve_trajectory: List[dict] = Field(default_factory=list, sa_column=Column(JSON))

    last_synced_at: datetime = Field(default_factory=datetime.utcnow)

    # --- One-to-one back to the owning user ---
    user_id: Optional[int] = Field(
        default=None, foreign_key="user.id", unique=True, index=True
    )
    owner: Optional[User] = Relationship(back_populates="leetcode_profile")


# --------------------------------------------------------------------------
# Audio Processing Job History
# --------------------------------------------------------------------------

class AudioProcessingJob(SQLModel, table=True):
    """
    One row per de-noising run through /api/process-audio. Persists the
    downsampled waveform arrays (same ~800-point peak-sampled format the
    endpoint already returns) so a user's past runs can be reloaded into
    AudioProcessor.jsx's visualizer without re-uploading or reprocessing
    the original file.
    """

    id: Optional[int] = Field(default=None, primary_key=True)

    file_name: str
    file_size_kb: float
    subtraction_threshold: float  # 0-100, matches the frontend slider value
    processing_time_ms: float

    # Native JSON float arrays — same downsampled points the API response
    # already sends the frontend, just persisted instead of transient.
    original_waveform: List[float] = Field(default_factory=list, sa_column=Column(JSON))
    processed_waveform: List[float] = Field(default_factory=list, sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # --- Foreign key back to the owning user ---
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    owner: Optional[User] = Relationship(back_populates="audio_jobs")


# --------------------------------------------------------------------------
# API-facing Read/Create variants
# --------------------------------------------------------------------------
# The table models above intentionally hold sensitive/internal fields
# (hashed_password, raw FK ids) that should never round-trip through a
# request or response body directly. These lightweight companion models
# are what your route handlers should actually use for request validation
# and response_model= typing.

class UserCreate(SQLModel):
    name: str
    email: str
    password: str  # plaintext in, hashed before it ever touches the DB


class UserRead(SQLModel):
    id: int
    name: str
    email: str
    current_cgpa: float
    current_theme: str


class ProjectCreate(SQLModel):
    title: str
    tag: str
    status: str = "todo"
    is_bookmarked: bool = False


class ProjectRead(SQLModel):
    id: int
    title: str
    tag: str
    status: str
    is_bookmarked: bool
    created_at: datetime


class LeetCodeProfileRead(SQLModel):
    username: str
    global_ranking: Optional[int]
    acceptance_rate: Optional[float]
    total_solved: int
    solve_trajectory: List[dict]


class AudioProcessingJobRead(SQLModel):
    id: int
    file_name: str
    file_size_kb: float
    subtraction_threshold: float
    processing_time_ms: float
    original_waveform: List[float]
    processed_waveform: List[float]
    created_at: datetime


# --------------------------------------------------------------------------
# Engine + table creation
# --------------------------------------------------------------------------
# SQLite is the default here for zero-setup local development. Swap
# DATABASE_URL for a Postgres connection string when you're ready to move
# off SQLite — SQLModel/SQLAlchemy handle both without touching the models
# above.

DATABASE_URL = "sqlite:///./engineerhub.db"

engine = create_engine(
    DATABASE_URL,
    echo=False,  # set True temporarily if you need to see generated SQL
    connect_args={"check_same_thread": False},  # required for SQLite + FastAPI
)


def init_db() -> None:
    """Creates all tables that don't already exist. Call once at app startup."""
    SQLModel.metadata.create_all(engine)
