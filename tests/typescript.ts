/**
 * SocialPulse API — User Profile and Social Graph Service
 *
 * A self-contained Express micro-service for an internal social-media-style platform.
 * Provides endpoints to query user profiles, search users, and retrieve social connections.
 *
 * @author     SocialPulse Team
 * @version    1.0.0
 * @license    MIT
 */

// ============================================================================
// Third-Party Packages
// ============================================================================
import express, {
    Application,    // Express application instance
    Request,        // HTTP request object
    Response,       // HTTP response object
    NextFunction    // Middleware next function
} from 'express';
import cors    from 'cors';           // Cross-Origin Resource Sharing middleware
import { v4 as uuidv4 } from 'uuid';  // UUID generation for unique identifiers

// ============================================================================
// Type Definitions — Data Models
// ============================================================================

/**
 * Full user profile with all account details.
 */
interface UserProfile {
    readonly userId         : string;        // UUID format, primary identifier
    readonly username       : string;        // 3-30 chars, alphanumeric + underscores only
    readonly displayName    : string;        // 1-100 chars
    readonly email          : string;        // Valid email format
    readonly bio            : string | null; // Max 500 chars, optional
    readonly avatarUrl      : string | null; // Valid URL or null
    readonly followerCount  : number;        // >= 0
    readonly followingCount : number;        // >= 0
    readonly isVerified     : boolean;       // Default false
    readonly createdAt      : Date;          // Account creation timestamp
    readonly tags           : string[];      // Interest tags, max 10 items
}

/**
 * Lightweight user projection for lists and search results.
 */
interface UserSummary {
    readonly userId      : string;
    readonly username    : string;
    readonly displayName : string;
    readonly avatarUrl   : string | null;
    readonly isVerified  : boolean;
}

/**
 * Paginated search result containing matching users.
 */
interface SearchResult {
    readonly query : string;        // The original search term
    readonly total : number;        // Total matches found
    readonly page  : number;        // Current page (1-indexed)
    readonly limit : number;        // Items per page
    readonly users : UserSummary[]; // Matching user summaries
}

/**
 * Represents a follower/following connection between users.
 */
interface FollowConnection {
    readonly userId         : string;                   // The user being queried
    readonly connectionId   : string;                   // The connected user's ID
    readonly connectionType : 'follower' | 'following'; // Type of connection
    readonly since          : Date;                     // When the connection was established
}

/**
 * Standardized API error response.
 */
interface ApiError {
    readonly status : number; // HTTP status code
    readonly detail : string; // Error message
}

// ============================================================================
// Type Definitions — Utility Types
// ============================================================================

/**
 * Discriminated union for operation results with type-safe success/failure handling.
 */
type Result<T> =
    | { success: true ; data  : T      }
    | { success: false; error : string };

/**
 * Pagination parameters for list endpoints.
 */
interface PaginationParams {
    readonly page  : number;
    readonly limit : number;
}

/**
 * Validated search parameters.
 */
interface SearchParams extends PaginationParams {
    readonly query : string;
}

/**
 * Internal follow relationship stored in the database.
 */
interface FollowRelation {
    readonly followerId  : string; // User who follows
    readonly followingId : string; // User being followed
    readonly since       : Date;   // When the follow occurred
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a Result is an error.
 *
 * @param   result - The result to check
 * @returns        - True if the result is an error
 */
function isResultError<T>(
    result : Result<T>
): result is { success: false; error: string } {
    return !result.success;
}

/**
 * Type guard to validate UUID v4 format.
 *
 * @param   value - The string to validate
 * @returns       - True if the string is a valid UUID v4
 */
function isValidUUID(value: string): boolean {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(value);
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates and parses a user ID parameter.
 *
 * @param   userId - The user ID to validate
 * @returns        - Result containing valid userId or error message
 */
function validateUserId(userId: string | undefined): Result<string> {
    if (!userId || typeof userId !== 'string') {
        return { success: false, error: 'User ID is required' };
    }

    if (!isValidUUID(userId)) {
        return { success: false, error: 'Invalid user ID format' };
    }

    return { success: true, data: userId };
}

/**
 * Validates and parses pagination parameters from query string.
 *
 * @param   pageStr  - The page query parameter
 * @param   limitStr - The limit query parameter
 * @param   maxLimit - Maximum allowed limit (default 100)
 * @returns          - Result containing valid pagination params or error message
 */
function validatePagination(
    pageStr  : string | undefined,
    limitStr : string | undefined,
    maxLimit : number = 100
): Result<PaginationParams> {
    const page  = pageStr  ? parseInt(pageStr, 10)  : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 20;

    if (isNaN(page) || page < 1) {
        return { success: false, error: 'Page must be a positive integer' };
    }

    if (isNaN(limit) || limit < 1) {
        return { success: false, error: 'Limit must be a positive integer' };
    }

    if (limit > maxLimit) {
        return { success: false, error: `Limit cannot exceed ${maxLimit}` };
    }

    return { success: true, data: { page, limit } };
}

/**
 * Validates search query parameters.
 *
 * @param   query    - The search query string
 * @param   pageStr  - The page query parameter
 * @param   limitStr - The limit query parameter
 * @returns          - Result containing valid search params or error message
 */
function validateSearchParams(
    query    : string | undefined,
    pageStr  : string | undefined,
    limitStr : string | undefined
): Result<SearchParams> {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return { success: false, error: "Query parameter 'q' is required" };
    }

    const paginationResult = validatePagination(pageStr, limitStr, 100);
    if (isResultError(paginationResult)) {
        return paginationResult;
    }

    return {
        success : true,
        data    : {
            query : query.trim(),
            ...paginationResult.data
        }
    };
}

// ============================================================================
// Logger Utility
// ============================================================================

/**
 * Logger function types for the logging utility.
 */
interface Logger {
    info    : (message: string, meta?: Record<string, unknown>) => void;
    warn    : (message: string, meta?: Record<string, unknown>) => void;
    error   : (message: string, meta?: Record<string, unknown>) => void;
    request : (method: string, path: string, statusCode: number, responseTime: number) => void;
}

/**
 * Simple logger utility for request logging and debugging.
 */
const logger: Logger = {
    /**
     * Logs an informational message.
     *
     * @param message - The message to log
     * @param meta    - Optional metadata object
     */
    info(message: string, meta?: Record<string, unknown>): void {
        const timestamp = new Date().toISOString();
        const metaStr   = meta ? ` ${JSON.stringify(meta)}` : '';
        console.log(`[${timestamp}] INFO: ${message}${metaStr}`);
    },

    /**
     * Logs a warning message.
     *
     * @param message - The message to log
     * @param meta    - Optional metadata object
     */
    warn(message: string, meta?: Record<string, unknown>): void {
        const timestamp = new Date().toISOString();
        const metaStr   = meta ? ` ${JSON.stringify(meta)}` : '';
        console.warn(`[${timestamp}] WARN: ${message}${metaStr}`);
    },

    /**
     * Logs an error message.
     *
     * @param message - The message to log
     * @param meta    - Optional metadata object
     */
    error(message: string, meta?: Record<string, unknown>): void {
        const timestamp = new Date().toISOString();
        const metaStr   = meta ? ` ${JSON.stringify(meta)}` : '';
        console.error(`[${timestamp}] ERROR: ${message}${metaStr}`);
    },

    /**
     * Logs a request with method, path, and response time.
     *
     * @param method       - HTTP method
     * @param path         - Request path
     * @param statusCode   - Response status code
     * @param responseTime - Response time in milliseconds
     */
    request(
        method       : string,
        path         : string,
        statusCode   : number,
        responseTime : number
    ): void {
        const timestamp = new Date().toISOString();
        console.log(
            `[${timestamp}] ${method} ${path} - ${statusCode} (${responseTime.toFixed(2)}ms)`
        );
    }
};

// ============================================================================
// Seeded Random Number Generator
// ============================================================================

/**
 * Simple seeded pseudo-random number generator (Mulberry32).
 * Provides reproducible random values for consistent mock data generation.
 */
class SeededRandom {
    private state: number;

    /**
     * Creates a new seeded random generator.
     *
     * @param seed - The seed value for reproducibility
     */
    constructor(seed: number) {
        this.state = seed;
    }

    /**
     * Generates the next random number between 0 and 1.
     *
     * @returns - A pseudo-random number between 0 (inclusive) and 1 (exclusive)
     */
    next(): number {
        this.state |= 0;
        this.state  = (this.state + 0x6D2B79F5) | 0;

        let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /**
     * Generates a random integer between min and max (inclusive).
     *
     * @param   min - Minimum value (inclusive)
     * @param   max - Maximum value (inclusive)
     * @returns     - A random integer in the range [min, max]
     */
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    /**
     * Picks a random element from an array.
     *
     * @param   array - The array to pick from
     * @returns       - A random element from the array
     */
    pick<T>(array: readonly T[]): T {
        return array[this.nextInt(0, array.length - 1)];
    }

    /**
     * Shuffles an array using Fisher-Yates algorithm.
     *
     * @param   array - The array to shuffle
     * @returns       - A new shuffled array
     */
    shuffle<T>(array: readonly T[]): T[] {
        const result = [...array];

        for (let i = result.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i);
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    }
}

// ============================================================================
// Mock Data Generation — Constants
// ============================================================================

/**
 * Sample first names for generating realistic usernames.
 */
const FIRST_NAMES = [
    'Alex',    'Jordan', 'Taylor', 'Morgan', 'Casey',
    'Riley',   'Quinn',  'Avery',  'Sage',   'River',
    'Skyler',  'Dakota', 'Reese',  'Jamie',  'Blake',
    'Cameron', 'Drew',   'Finley', 'Hayden', 'Kendall',
    'Logan',   'Peyton', 'Parker', 'Rowan',  'Spencer'
] as const;

/**
 * Sample last names for generating realistic display names.
 */
const LAST_NAMES = [
    'Smith',    'Johnson', 'Williams', 'Brown',    'Jones',
    'Garcia',   'Miller',  'Davis',    'Martinez', 'Anderson',
    'Wilson',   'Taylor',  'Thomas',   'Moore',    'Jackson',
    'Martin',   'Lee',     'Thompson', 'White',    'Harris',
    'Robinson', 'Clark',   'Lewis',    'Young',    'Walker'
] as const;

/**
 * Sample interest tags for user profiles.
 */
const INTEREST_TAGS = [
    'technology', 'gaming',    'music',     'art',       'photography',
    'travel',     'food',      'fitness',   'sports',    'movies',
    'books',      'coding',    'design',    'fashion',   'nature',
    'science',    'politics',  'comedy',    'education', 'business',
    'startup',    'crypto',    'ai',        'webdev',    'mobile',
    'opensource', 'devops',    'cloud',     'security',  'datascience'
] as const;

/**
 * Sample bio templates for generating user bios.
 */
const BIO_TEMPLATES = [
    'Passionate about {tag1} and {tag2}. Always learning something new.',
    '{tag1} enthusiast | {tag2} lover | Building cool things',
    'Just here for the {tag1} content. Also into {tag2}.',
    'Professional {tag1} advocate. Part-time {tag2} explorer.',
    'Living life one {tag1} at a time. {tag2} on the side.',
    null, // Some users have no bio
    null,
    'Working on exciting projects in {tag1} and {tag2}!',
    '{tag1} | {tag2} | Coffee addict ☕',
    null
] as const;

// ============================================================================
// Mock Database Class
// ============================================================================

/**
 * In-memory mock database for user profiles and social connections.
 * Generates realistic fake data on initialization with seeded randomness
 * for reproducibility.
 */
class MockDatabase {
    private readonly users           : Map<string, UserProfile>;
    private readonly followRelations : FollowRelation[];
    private readonly rng             : SeededRandom;

    /**
     * Creates and initializes the mock database with fake users and connections.
     *
     * @param userCount - Number of users to generate (default 50)
     * @param seed      - Random seed for reproducibility (default 12345)
     */
    constructor(
        userCount : number = 50,
        seed      : number = 12345
    ) {
        this.users           = new Map();
        this.followRelations = [];
        this.rng             = new SeededRandom(seed);

        this.generateUsers(userCount);
        this.generateFollowRelations();
    }

    // ------------------------------------------------------------------------
    // Private — Data Generation
    // ------------------------------------------------------------------------

    /**
     * Generates a random username from first name and random suffix.
     *
     * @returns - A unique username
     */
    private generateUsername(): string {
        const firstName = this.rng.pick(FIRST_NAMES).toLowerCase();
        const suffix    = this.rng.nextInt(1, 9999);
        const separator = this.rng.next() > 0.5 ? '_' : '';

        return `${firstName}${separator}${suffix}`;
    }

    /**
     * Generates a display name from random first and last names.
     *
     * @returns - A full display name
     */
    private generateDisplayName(): string {
        const firstName = this.rng.pick(FIRST_NAMES);
        const lastName  = this.rng.pick(LAST_NAMES);

        return `${firstName} ${lastName}`;
    }

    /**
     * Generates a random email address.
     *
     * @param   username - The username to base the email on
     * @returns          - A valid email address
     */
    private generateEmail(username: string): string {
        const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'proton.me', 'icloud.com'];
        const domain  = this.rng.pick(domains);

        return `${username}@${domain}`;
    }

    /**
     * Generates random interest tags for a user.
     *
     * @returns - Array of 1-10 interest tags
     */
    private generateTags(): string[] {
        const tagCount     = this.rng.nextInt(1, 10);
        const shuffledTags = this.rng.shuffle(INTEREST_TAGS);

        return shuffledTags.slice(0, tagCount);
    }

    /**
     * Generates a bio using random tags.
     *
     * @param   tags - The user's interest tags
     * @returns      - A bio string or null
     */
    private generateBio(tags: string[]): string | null {
        const template = this.rng.pick(BIO_TEMPLATES);

        if (template === null || tags.length < 2) {
            return null;
        }

        return template
            .replace('{tag1}', tags[0])
            .replace('{tag2}', tags[1]);
    }

    /**
     * Generates a random avatar URL or null.
     *
     * @param   userId - The user's ID for the avatar
     * @returns        - An avatar URL or null
     */
    private generateAvatarUrl(userId: string): string | null {
        // 80% chance of having an avatar
        if (this.rng.next() > 0.8) {
            return null;
        }

        // Use a placeholder avatar service
        const seed = userId.substring(0, 8);
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    }

    /**
     * Generates a random past date within the last 3 years.
     *
     * @returns - A Date object representing account creation
     */
    private generateCreatedAt(): Date {
        const now        = Date.now();
        const threeYears = 3 * 365 * 24 * 60 * 60 * 1000;
        const offset     = this.rng.next() * threeYears;

        return new Date(now - offset);
    }

    /**
     * Generates the specified number of fake users.
     *
     * @param count - Number of users to generate
     */
    private generateUsers(count: number): void {
        for (let i = 0; i < count; i++) {
            const userId      = uuidv4();
            const username    = this.generateUsername();
            const displayName = this.generateDisplayName();
            const email       = this.generateEmail(username);
            const tags        = this.generateTags();
            const bio         = this.generateBio(tags);
            const avatarUrl   = this.generateAvatarUrl(userId);
            const isVerified  = this.rng.next() < 0.1; // 10% chance of verification
            const createdAt   = this.generateCreatedAt();

            const user: UserProfile = {
                userId,
                username,
                displayName,
                email,
                bio,
                avatarUrl,
                followerCount  : 0, // Will be updated after generating relations
                followingCount : 0,
                isVerified,
                createdAt,
                tags
            };

            this.users.set(userId, user);
        }
    }

    /**
     * Generates random follow relationships between users.
     * Each user follows 0-30 other users randomly.
     */
    private generateFollowRelations(): void {
        const userIds = Array.from(this.users.keys());

        for (const followerId of userIds) {
            // Each user follows between 0 and 30 other users
            const followCount = this.rng.nextInt(0, 30);
            const candidates  = userIds.filter(id => id !== followerId);
            const toFollow    = this.rng.shuffle(candidates).slice(0, followCount);

            for (const followingId of toFollow) {
                const since = this.generateCreatedAt();

                this.followRelations.push({
                    followerId,
                    followingId,
                    since
                });
            }
        }

        // Update follower/following counts on user profiles
        this.updateFollowCounts();
    }

    /**
     * Updates follower and following counts on all user profiles.
     */
    private updateFollowCounts(): void {
        // Count followers and following for each user
        const followerCounts  = new Map<string, number>();
        const followingCounts = new Map<string, number>();

        for (const relation of this.followRelations) {
            // Increment following count for the follower
            const currentFollowing = followingCounts.get(relation.followerId) ?? 0;
            followingCounts.set(relation.followerId, currentFollowing + 1);

            // Increment follower count for the user being followed
            const currentFollowers = followerCounts.get(relation.followingId) ?? 0;
            followerCounts.set(relation.followingId, currentFollowers + 1);
        }

        // Update user profiles with counts
        for (const [userId, user] of this.users) {
            const updatedUser: UserProfile = {
                ...user,
                followerCount  : followerCounts.get(userId)  ?? 0,
                followingCount : followingCounts.get(userId) ?? 0
            };
            this.users.set(userId, updatedUser);
        }
    }

    // ------------------------------------------------------------------------
    // Public — Query Methods
    // ------------------------------------------------------------------------

    /**
     * Gets the total number of users in the database.
     *
     * @returns - The number of users
     */
    getUserCount(): number {
        return this.users.size;
    }

    /**
     * Retrieves a user profile by ID.
     *
     * @param   userId - The user's unique identifier
     * @returns        - The user profile or undefined if not found
     */
    getUser(userId: string): UserProfile | undefined {
        return this.users.get(userId);
    }

    /**
     * Searches for users by query string.
     * Matches against username, displayName, and tags (case-insensitive partial match).
     *
     * @param   query - The search query
     * @param   page  - Page number (1-indexed)
     * @param   limit - Number of results per page
     * @returns       - Search results with pagination
     */
    searchUsers(
        query : string,
        page  : number,
        limit : number
    ): SearchResult {
        const normalizedQuery = query.toLowerCase().trim();

        // Find all matching users
        const matchingUsers: UserSummary[] = [];

        for (const user of this.users.values()) {
            const matchesUsername    = user.username.toLowerCase().includes(normalizedQuery);
            const matchesDisplayName = user.displayName.toLowerCase().includes(normalizedQuery);
            const matchesTags        = user.tags.some(tag =>
                tag.toLowerCase().includes(normalizedQuery)
            );

            if (matchesUsername || matchesDisplayName || matchesTags) {
                matchingUsers.push({
                    userId      : user.userId,
                    username    : user.username,
                    displayName : user.displayName,
                    avatarUrl   : user.avatarUrl,
                    isVerified  : user.isVerified
                });
            }
        }

        // Apply pagination
        const total     = matchingUsers.length;
        const startIdx  = (page - 1) * limit;
        const endIdx    = startIdx + limit;
        const pageUsers = matchingUsers.slice(startIdx, endIdx);

        return {
            query,
            total,
            page,
            limit,
            users : pageUsers
        };
    }

    /**
     * Gets the followers of a user.
     *
     * @param   userId - The user's unique identifier
     * @param   page   - Page number (1-indexed)
     * @param   limit  - Number of results per page
     * @returns        - Array of follow connections or undefined if user not found
     */
    getFollowers(
        userId : string,
        page   : number,
        limit  : number
    ): FollowConnection[] | undefined {
        if (!this.users.has(userId)) {
            return undefined;
        }

        // Find all users who follow this user
        const followers = this.followRelations
            .filter(rel => rel.followingId === userId)
            .map(rel => ({
                userId,
                connectionId   : rel.followerId,
                connectionType : 'follower' as const,
                since          : rel.since
            }));

        // Apply pagination
        const startIdx = (page - 1) * limit;
        const endIdx   = startIdx + limit;

        return followers.slice(startIdx, endIdx);
    }

    /**
     * Gets the users that a user is following.
     *
     * @param   userId - The user's unique identifier
     * @param   page   - Page number (1-indexed)
     * @param   limit  - Number of results per page
     * @returns        - Array of follow connections or undefined if user not found
     */
    getFollowing(
        userId : string,
        page   : number,
        limit  : number
    ): FollowConnection[] | undefined {
        if (!this.users.has(userId)) {
            return undefined;
        }

        // Find all users this user follows
        const following = this.followRelations
            .filter(rel => rel.followerId === userId)
            .map(rel => ({
                userId,
                connectionId   : rel.followingId,
                connectionType : 'following' as const,
                since          : rel.since
            }));

        // Apply pagination
        const startIdx = (page - 1) * limit;
        const endIdx   = startIdx + limit;

        return following.slice(startIdx, endIdx);
    }
}

// ============================================================================
// Express Middleware
// ============================================================================

/**
 * Request logging middleware.
 * Logs each request with method, path, status code, and response time.
 *
 * @param   req  - Express request object
 * @param   res  - Express response object
 * @param   next - Next middleware function
 */
function requestLogger(
    req  : Request,
    res  : Response,
    next : NextFunction
): void {
    const startTime = Date.now();

    // Capture the response finish event
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        logger.request(req.method, req.path, res.statusCode, responseTime);
    });

    next();
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Sends a successful JSON response.
 *
 * @param res  - Express response object
 * @param data - Data to send
 */
function sendSuccess<T>(res: Response, data: T): void {
    res.status(200).json(data);
}

/**
 * Sends an error response with proper status code.
 *
 * @param res    - Express response object
 * @param status - HTTP status code
 * @param detail - Error message
 */
function sendError(
    res    : Response,
    status : number,
    detail : string
): void {
    const error: ApiError = { status, detail };
    res.status(status).json(error);
}

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * Creates the Express application with all routes configured.
 *
 * @param   db - The mock database instance
 * @returns    - Configured Express application
 */
function createApp(db: MockDatabase): Application {
    const app = express();

    // ------------------------------------------------------------------------
    // Middleware
    // ------------------------------------------------------------------------
    app.use(cors());          // Enable CORS for all origins
    app.use(express.json());  // Parse JSON request bodies
    app.use(requestLogger);   // Log all requests

    // ------------------------------------------------------------------------
    // Routes — Health Check
    // ------------------------------------------------------------------------

    /**
     * GET /health
     * Health check endpoint to verify the service is running.
     */
    app.get('/health', (_req: Request, res: Response): void => {
        sendSuccess(res, { status: 'ok' });
    });

    // ------------------------------------------------------------------------
    // Routes — User Profile
    // ------------------------------------------------------------------------

    /**
     * GET /users/:userId
     * Retrieves a full user profile by ID.
     */
    app.get('/users/:userId', (req: Request, res: Response): void => {
        const userIdResult = validateUserId(req.params.userId);

        if (isResultError(userIdResult)) {
            sendError(res, 400, userIdResult.error);
            return;
        }

        const user = db.getUser(userIdResult.data);

        if (!user) {
            sendError(res, 404, 'User not found');
            return;
        }

        sendSuccess(res, user);
    });

    // ------------------------------------------------------------------------
    // Routes — Followers
    // ------------------------------------------------------------------------

    /**
     * GET /users/:userId/followers
     * Retrieves a paginated list of a user's followers.
     */
    app.get('/users/:userId/followers', (req: Request, res: Response): void => {
        const userIdResult = validateUserId(req.params.userId);

        if (isResultError(userIdResult)) {
            sendError(res, 400, userIdResult.error);
            return;
        }

        const paginationResult = validatePagination(
            req.query.page  as string | undefined,
            req.query.limit as string | undefined
        );

        if (isResultError(paginationResult)) {
            sendError(res, 400, paginationResult.error);
            return;
        }

        const { page, limit } = paginationResult.data;
        const followers       = db.getFollowers(userIdResult.data, page, limit);

        if (followers === undefined) {
            sendError(res, 404, 'User not found');
            return;
        }

        sendSuccess(res, followers);
    });

    // ------------------------------------------------------------------------
    // Routes — Following
    // ------------------------------------------------------------------------

    /**
     * GET /users/:userId/following
     * Retrieves a paginated list of users that a user is following.
     */
    app.get('/users/:userId/following', (req: Request, res: Response): void => {
        const userIdResult = validateUserId(req.params.userId);

        if (isResultError(userIdResult)) {
            sendError(res, 400, userIdResult.error);
            return;
        }

        const paginationResult = validatePagination(
            req.query.page  as string | undefined,
            req.query.limit as string | undefined
        );

        if (isResultError(paginationResult)) {
            sendError(res, 400, paginationResult.error);
            return;
        }

        const { page, limit } = paginationResult.data;
        const following       = db.getFollowing(userIdResult.data, page, limit);

        if (following === undefined) {
            sendError(res, 404, 'User not found');
            return;
        }

        sendSuccess(res, following);
    });

    // ------------------------------------------------------------------------
    // Routes — Search
    // ------------------------------------------------------------------------

    /**
     * GET /search
     * Searches for users by query string.
     * Matches against username, displayName, and tags.
     */
    app.get('/search', (req: Request, res: Response): void => {
        const searchResult = validateSearchParams(
            req.query.q     as string | undefined,
            req.query.page  as string | undefined,
            req.query.limit as string | undefined
        );

        if (isResultError(searchResult)) {
            sendError(res, 400, searchResult.error);
            return;
        }

        const { query, page, limit } = searchResult.data;
        const results = db.searchUsers(query, page, limit);

        sendSuccess(res, results);
    });

    return app;
}

// ============================================================================
// Server Entry Point
// ============================================================================

/**
 * Server configuration.
 */
const SERVER_CONFIG = {
    host : '0.0.0.0',
    port : 8000
} satisfies Record<string, string | number>;

/**
 * Initializes and starts the SocialPulse API server.
 */
function main(): void {
    // Initialize mock database with 50 users
    const db = new MockDatabase(50, 12345);

    // Create and configure Express app
    const app = createApp(db);

    // Start the server
    app.listen(SERVER_CONFIG.port, SERVER_CONFIG.host, () => {
        logger.info('SocialPulse API started', {
            host       : SERVER_CONFIG.host,
            port       : SERVER_CONFIG.port,
            usersCount : db.getUserCount()
        });
        logger.info(`Mock database initialized with ${db.getUserCount()} users`);
    });
}

// Run the server
main();
