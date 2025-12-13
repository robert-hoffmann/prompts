"""
SocialPulse API — User Profile and Social Graph Service.

A FastAPI micro-service providing endpoints to query user profiles,
search users, and retrieve social connections for an internal
social-media-style platform.

All data is mocked in-memory for demonstration purposes.
"""
# ============================================================================
# Futures (always first)
# ============================================================================
from __future__ import annotations  # PEP 563: Postponed evaluation

# ============================================================================
# Standard Library
# ============================================================================
import logging   # Logging facility
import random    # Random number generation (seeded for reproducibility)
import time      # Time measurement for request logging
import uuid      # UUID generation for user IDs

from contextlib import asynccontextmanager  # Async context manager for lifespan
from datetime   import datetime, timedelta  # Date/time and duration handling
from typing     import Literal              # Literal type for fixed string values

# ============================================================================
# Third-Party Packages
# ============================================================================
from fastapi import (
    FastAPI,      # Web framework
    HTTPException,# HTTP error responses
    Query,        # Query parameter validation
    Request       # Request object for middleware
)
from fastapi.middleware.cors import CORSMiddleware  # CORS support
from fastapi.responses       import JSONResponse    # JSON response helper

from pydantic import (
    BaseModel,        # Base class for validated data models
    ConfigDict,       # Model configuration (strict, frozen, etc.)
    Field,            # Field constraints and metadata
    field_validator   # Decorator for field-level validation (v2 API)
)

import uvicorn  # ASGI server

# ============================================================================
# Logging Configuration
# ============================================================================
logging.basicConfig(
    level  = logging.INFO,
    format = "%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt= "%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("socialpulse")


# ============================================================================
# Pydantic Models — Data Validation and Serialization
# ============================================================================

class UserProfile(BaseModel):
    """
    Full user profile with all details.

    Attributes:
        user_id         : UUID format, primary identifier.
        username        : 3-30 chars, alphanumeric + underscores only.
        display_name    : 1-100 chars, human-readable name.
        email           : Valid email format.
        bio             : Max 500 chars, optional.
        avatar_url      : Valid URL or None.
        follower_count  : Number of followers (>= 0).
        following_count : Number of users being followed (>= 0).
        is_verified     : Verification badge status.
        created_at      : Account creation timestamp.
        tags            : Interest tags, max 10 items.
    """
    model_config = ConfigDict(strict=True)

    user_id         : str            = Field(pattern=r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
    username        : str            = Field(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    display_name    : str            = Field(min_length=1, max_length=100)
    email           : str            = Field(pattern=r'^[\w\.\-\+]+@[\w\.\-]+\.\w+$')
    bio             : str | None     = Field(default=None, max_length=500)
    avatar_url      : str | None     = Field(default=None, pattern=r'^https?://.+')
    follower_count  : int            = Field(ge=0)
    following_count : int            = Field(ge=0)
    is_verified     : bool           = Field(default=False)
    created_at      : datetime
    tags            : list[str]      = Field(default_factory=list, max_length=10)

    @field_validator('tags')
    @classmethod
    def validate_tags_count(cls, v: list[str]) -> list[str]:
        """Ensure tags list has at most 10 items."""
        if len(v) > 10:
            raise ValueError('Maximum 10 tags allowed')
        return v


class UserSummary(BaseModel):
    """
    Lightweight user projection for lists and search results.

    Attributes:
        user_id      : UUID format, primary identifier.
        username     : User's unique handle.
        display_name : Human-readable display name.
        avatar_url   : Profile picture URL or None.
        is_verified  : Verification badge status.
    """
    model_config = ConfigDict(strict=True)

    user_id      : str
    username     : str
    display_name : str
    avatar_url   : str | None
    is_verified  : bool


class SearchResult(BaseModel):
    """
    Paginated search result container.

    Attributes:
        query : The original search term.
        total : Total matches found.
        page  : Current page (1-indexed).
        limit : Items per page.
        users : List of matching user summaries.
    """
    model_config = ConfigDict(strict=True)

    query : str
    total : int
    page  : int
    limit : int
    users : list[UserSummary]


class FollowConnection(BaseModel):
    """
    Represents a follow relationship between users.

    Attributes:
        user_id         : The user being queried.
        connection_id   : The connected user's ID.
        connection_type : Type of connection (follower or following).
        since           : When the connection was established.
    """
    model_config = ConfigDict(strict=True)

    user_id         : str
    connection_id   : str
    connection_type : Literal["follower", "following"]
    since           : datetime


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str


# ============================================================================
# Mock Data Layer
# ============================================================================

# Realistic sample data for user generation
FIRST_NAMES = [
    "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery",
    "Cameron", "Dakota", "Emerson", "Finley", "Harper", "Hayden", "Jamie",
    "Kendall", "Logan", "Mason", "Nico", "Parker", "Peyton", "Reese", "River",
    "Rowan", "Sage", "Sawyer", "Skyler", "Spencer", "Sydney", "Tatum"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Moore",
    "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Clark", "Lewis",
    "Walker", "Hall", "Young", "King", "Wright", "Lopez", "Hill", "Scott"
]

INTEREST_TAGS = [
    "photography", "music", "gaming", "travel", "food", "fitness", "tech",
    "art", "fashion", "sports", "movies", "books", "coding", "nature",
    "science", "design", "cooking", "yoga", "hiking", "coffee", "wine",
    "cars", "pets", "diy", "gardening", "investing", "crypto", "ai", "ml",
    "startup", "entrepreneur", "marketing", "writing", "podcast", "streaming"
]

BIOS = [
    "Living my best life ✨",
    "Coffee enthusiast | Code craftsman | Cat person",
    "Explorer of the digital frontier 🚀",
    "Making the world a better place, one commit at a time",
    "Professional overthinker. Amateur everything else.",
    "Building cool stuff @TechCorp",
    "Software engineer by day, gamer by night 🎮",
    "On a mission to learn something new every day",
    "Turning coffee into code since 2015",
    "Just here for the memes",
    None,  # Some users have no bio
    None,
    None,
]


class MockDatabase:
    """
    In-memory mock database for user profiles and social connections.

    Generates realistic fake users and follow relationships on initialization.
    Uses a deterministic seed for reproducibility.

    Attributes:
        users       : Dictionary mapping user_id to UserProfile.
        followers   : Dictionary mapping user_id to list of follower connections.
        following   : Dictionary mapping user_id to list of following connections.
    """

    def __init__(self, seed: int = 42, user_count: int = 50) -> None:
        """
        Initialize the mock database with fake users and relationships.

        Args:
            seed       : Random seed for reproducibility.
            user_count : Number of users to generate.
        """
        random.seed(seed)

        self.users     : dict[str, UserProfile]         = {}
        self.followers : dict[str, list[FollowConnection]] = {}
        self.following : dict[str, list[FollowConnection]] = {}

        # Generate users
        self._generate_users(user_count)

        # Generate follow relationships
        self._generate_relationships()

        # Update follower/following counts
        self._update_counts()

        logger.info(f"MockDatabase initialized with {len(self.users)} users")

    def _generate_users(self, count: int) -> None:
        """Generate fake user profiles."""
        base_date = datetime(2020, 1, 1)

        for i in range(count):
            user_id      = str(uuid.UUID(int=random.getrandbits(128)))
            first_name   = random.choice(FIRST_NAMES)
            last_name    = random.choice(LAST_NAMES)
            display_name = f"{first_name} {last_name}"
            username     = f"{first_name.lower()}_{last_name.lower()}_{random.randint(1, 999)}"

            # Random creation date within the past 4 years
            days_ago   = random.randint(0, 1460)
            created_at = base_date + timedelta(days=days_ago)

            # Select random tags (0-8 tags per user)
            num_tags = random.randint(0, 8)
            tags     = random.sample(INTEREST_TAGS, min(num_tags, len(INTEREST_TAGS)))

            # Create avatar URL (some users have avatars)
            avatar_url = f"https://avatars.example.com/{user_id}.jpg" if random.random() > 0.2 else None

            # Bio selection
            bio = random.choice(BIOS)

            user = UserProfile(
                user_id         = user_id,
                username        = username[:30],  # Ensure max length
                display_name    = display_name,
                email           = f"{username[:20]}@example.com",
                bio             = bio,
                avatar_url      = avatar_url,
                follower_count  = 0,  # Will be updated after relationships
                following_count = 0,
                is_verified     = random.random() < 0.1,  # 10% verified
                created_at      = created_at,
                tags            = tags
            )

            self.users[user_id]     = user
            self.followers[user_id] = []
            self.following[user_id] = []

    def _generate_relationships(self) -> None:
        """Generate random follow relationships between users."""
        user_ids = list(self.users.keys())

        for user_id in user_ids:
            # Each user follows 0-20 other users
            num_following = random.randint(0, 20)
            potential     = [uid for uid in user_ids if uid != user_id]
            follows       = random.sample(potential, min(num_following, len(potential)))

            for followed_id in follows:
                # Random timestamp for when the follow happened
                days_ago   = random.randint(0, 365)
                since_date = datetime.now() - timedelta(days=days_ago)

                # Add to following list
                self.following[user_id].append(
                    FollowConnection(
                        user_id         = user_id,
                        connection_id   = followed_id,
                        connection_type = "following",
                        since           = since_date
                    )
                )

                # Add to follower list of the followed user
                self.followers[followed_id].append(
                    FollowConnection(
                        user_id         = followed_id,
                        connection_id   = user_id,
                        connection_type = "follower",
                        since           = since_date
                    )
                )

    def _update_counts(self) -> None:
        """Update follower and following counts based on relationships."""
        for user_id, user in self.users.items():
            # Create new UserProfile with updated counts
            self.users[user_id] = UserProfile(
                user_id         = user.user_id,
                username        = user.username,
                display_name    = user.display_name,
                email           = user.email,
                bio             = user.bio,
                avatar_url      = user.avatar_url,
                follower_count  = len(self.followers[user_id]),
                following_count = len(self.following[user_id]),
                is_verified     = user.is_verified,
                created_at      = user.created_at,
                tags            = user.tags
            )

    def get_user(self, user_id: str) -> UserProfile | None:
        """
        Retrieve a user profile by ID.

        Args:
            user_id : The UUID of the user to retrieve.

        Returns:
            UserProfile if found, None otherwise.
        """
        return self.users.get(user_id)

    def search_users(
        self,
        query : str,
        page  : int = 1,
        limit : int = 20
    ) -> SearchResult:
        """
        Search users by username, display_name, or tags.

        Case-insensitive partial matching is performed.

        Args:
            query : Search term to match against user fields.
            page  : Page number (1-indexed).
            limit : Maximum results per page.

        Returns:
            SearchResult containing matching users and pagination info.
        """
        query_lower = query.lower()
        matches: list[UserProfile] = []

        for user in self.users.values():
            # Check username
            if query_lower in user.username.lower():
                matches.append(user)
                continue

            # Check display name
            if query_lower in user.display_name.lower():
                matches.append(user)
                continue

            # Check tags
            for tag in user.tags:
                if query_lower in tag.lower():
                    matches.append(user)
                    break

        # Calculate pagination
        total       = len(matches)
        start_index = (page - 1) * limit
        end_index   = start_index + limit
        page_items  = matches[start_index:end_index]

        # Convert to UserSummary
        summaries = [
            UserSummary(
                user_id      = u.user_id,
                username     = u.username,
                display_name = u.display_name,
                avatar_url   = u.avatar_url,
                is_verified  = u.is_verified
            )
            for u in page_items
        ]

        return SearchResult(
            query = query,
            total = total,
            page  = page,
            limit = limit,
            users = summaries
        )

    def get_followers(
        self,
        user_id : str,
        page    : int = 1,
        limit   : int = 20
    ) -> list[FollowConnection]:
        """
        Get paginated list of followers for a user.

        Args:
            user_id : The UUID of the user.
            page    : Page number (1-indexed).
            limit   : Maximum results per page.

        Returns:
            List of FollowConnection objects representing followers.
        """
        followers   = self.followers.get(user_id, [])
        start_index = (page - 1) * limit
        end_index   = start_index + limit
        return followers[start_index:end_index]

    def get_following(
        self,
        user_id : str,
        page    : int = 1,
        limit   : int = 20
    ) -> list[FollowConnection]:
        """
        Get paginated list of users being followed.

        Args:
            user_id : The UUID of the user.
            page    : Page number (1-indexed).
            limit   : Maximum results per page.

        Returns:
            List of FollowConnection objects representing following relationships.
        """
        following   = self.following.get(user_id, [])
        start_index = (page - 1) * limit
        end_index   = start_index + limit
        return following[start_index:end_index]


# ============================================================================
# Global Database Instance
# ============================================================================
db: MockDatabase


# ============================================================================
# FastAPI Application — Lifespan and Middleware
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for application startup and shutdown.

    Initializes the mock database on startup and logs shutdown message.
    """
    global db

    # Startup
    logger.info("SocialPulse API starting...")
    db = MockDatabase(seed=42, user_count=50)
    logger.info(f"SocialPulse API started — {len(db.users)} mock users loaded")

    yield  # Application runs here

    # Shutdown
    logger.info("SocialPulse API shutting down...")


app = FastAPI(
    title       = "SocialPulse API",
    description = "User profile and social graph service for internal social-media platform",
    version     = "1.0.0",
    lifespan    = lifespan
)

# Enable CORS for all origins (local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"]
)


# ============================================================================
# Request Logging Middleware
# ============================================================================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log each HTTP request with method, path, and response time.

    Args:
        request   : The incoming HTTP request.
        call_next : The next middleware/handler in the chain.

    Returns:
        The response from the handler.
    """
    start_time = time.perf_counter()

    response = await call_next(request)

    # Calculate response time
    process_time = (time.perf_counter() - start_time) * 1000  # Convert to ms

    logger.info(
        f"{request.method} {request.url.path} — "
        f"Status: {response.status_code} — "
        f"Time: {process_time:.2f}ms"
    )

    return response


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.

    Returns:
        JSON object with status "ok".
    """
    return HealthResponse(status="ok")


@app.get("/users/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str) -> UserProfile:
    """
    Get full user profile by ID.

    Args:
        user_id : UUID of the user to retrieve.

    Returns:
        Full UserProfile object.

    Raises:
        HTTPException : 404 if user not found.
    """
    user = db.get_user(user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@app.get("/users/{user_id}/followers", response_model=list[FollowConnection])
async def get_user_followers(
    user_id : str,
    page    : int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    limit   : int = Query(default=20, ge=1, le=100, description="Items per page")
) -> list[FollowConnection]:
    """
    Get paginated list of followers for a user.

    Args:
        user_id : UUID of the user.
        page    : Page number (1-indexed).
        limit   : Maximum results per page (1-100).

    Returns:
        List of FollowConnection objects.

    Raises:
        HTTPException : 404 if user not found.
    """
    # Verify user exists
    if db.get_user(user_id) is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db.get_followers(user_id, page=page, limit=limit)


@app.get("/users/{user_id}/following", response_model=list[FollowConnection])
async def get_user_following(
    user_id : str,
    page    : int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    limit   : int = Query(default=20, ge=1, le=100, description="Items per page")
) -> list[FollowConnection]:
    """
    Get paginated list of users being followed.

    Args:
        user_id : UUID of the user.
        page    : Page number (1-indexed).
        limit   : Maximum results per page (1-100).

    Returns:
        List of FollowConnection objects.

    Raises:
        HTTPException : 404 if user not found.
    """
    # Verify user exists
    if db.get_user(user_id) is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db.get_following(user_id, page=page, limit=limit)


@app.get("/search", response_model=SearchResult)
async def search_users(
    q     : str = Query(..., min_length=1, description="Search query"),
    page  : int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    limit : int = Query(default=20, ge=1, le=100, description="Items per page (max 100)")
) -> SearchResult:
    """
    Search users by username, display name, or tags.

    Args:
        q     : Search query string (required, non-empty).
        page  : Page number (1-indexed).
        limit : Maximum results per page (1-100).

    Returns:
        SearchResult with matching users and pagination info.

    Raises:
        HTTPException : 400 if query is empty.
    """
    if not q.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    return db.search_users(query=q, page=page, limit=limit)


# ============================================================================
# Entry Point
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "tests.python:app",
        host   = "0.0.0.0",
        port   = 8000,
        reload = True
    )
