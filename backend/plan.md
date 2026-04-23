# Prisma ORM

Prisma is a next-generation Node.js and TypeScript ORM that provides type-safe database access, declarative data modeling, and automated migrations. It consists of three core tools: Prisma Client (auto-generated type-safe query builder), Prisma Migrate (declarative migration system), and Prisma Studio (GUI for database management). Prisma supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, CockroachDB, and MongoDB.

The ORM works by defining your data model in a Prisma schema file, then generating a fully type-safe client tailored to your schema. This approach eliminates runtime errors from typos or invalid queries while providing excellent IDE autocompletion. Prisma uses driver adapters to connect to databases, allowing flexibility in choosing database drivers and connection pooling strategies.

## Prisma Schema Definition

The Prisma schema defines your data model and client generator configuration. In Prisma ORM v7, connection URLs are configured in `prisma.config.ts`, not in `schema.prisma`.

```prisma
// schema.prisma
datasource db {
  provider = "mysql"
}

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

## Prisma Configuration (prisma.config.ts)

Configure the Prisma CLI and runtime settings using a TypeScript configuration file. In Prisma ORM v7, `DATABASE_URL` is read from `prisma.config.ts`.

```typescript
// prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

type Env = {
  DATABASE_URL: string
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
})
```

## Prisma Client Initialization with Driver Adapters

Initialize Prisma Client with a database driver adapter. For this project, use the MariaDB/MySQL adapter with `DATABASE_URL`.

```typescript
import { PrismaClient } from './generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })
```

## findMany - Query Multiple Records

Retrieve multiple records with filtering, sorting, pagination, and relation loading.

```typescript
// Basic findMany
const users = await prisma.user.findMany()

// With filtering
const activeUsers = await prisma.user.findMany({
  where: {
    email: { contains: '@company.com' },
    posts: { some: { published: true } },
  },
})

// With sorting and pagination
const paginatedUsers = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' },
  skip: 10,
  take: 5,
})

// With relation loading
const usersWithPosts = await prisma.user.findMany({
  include: { posts: true },
})

// With field selection
const userEmails = await prisma.user.findMany({
  select: { id: true, email: true },
})
```

## findUnique and findFirst - Query Single Records

Find a single record by unique identifier or matching criteria.

```typescript
// Find by unique field
const user = await prisma.user.findUnique({
  where: { email: 'alice@prisma.io' },
})

// Find by ID with relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: 'user-uuid-123' },
  include: { posts: { where: { published: true } } },
})

// Find first matching record
const firstAdmin = await prisma.user.findFirst({
  where: { role: 'ADMIN' },
  orderBy: { createdAt: 'asc' },
})

// Throw if not found
const requiredUser = await prisma.user.findUniqueOrThrow({
  where: { id: 'user-uuid-123' },
})
```

## create - Insert Records

Create new records with optional nested relation creation.

```typescript
// Simple create
const newUser = await prisma.user.create({
  data: {
    email: 'bob@prisma.io',
    name: 'Bob',
  },
})

// Create with nested relation
const userWithPost = await prisma.user.create({
  data: {
    email: 'alice@prisma.io',
    name: 'Alice',
    posts: {
      create: [
        { title: 'Hello World', content: 'My first post' },
        { title: 'Second Post', published: true },
      ],
    },
  },
  include: { posts: true },
})

// Create many records
const batchResult = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
    { email: 'user3@example.com', name: 'User 3' },
  ],
  skipDuplicates: true,
})
// Returns: { count: 3 }
```

## update and updateMany - Modify Records

Update existing records with various update operations.

```typescript
// Update single record
const updatedUser = await prisma.user.update({
  where: { email: 'alice@prisma.io' },
  data: { name: 'Alice Smith' },
})

// Update with nested operations
const userUpdate = await prisma.user.update({
  where: { id: 'user-uuid-123' },
  data: {
    posts: {
      updateMany: {
        where: { published: false },
        data: { published: true },
      },
    },
  },
})

// Update many records
const result = await prisma.post.updateMany({
  where: { authorId: 'user-uuid-123' },
  data: { published: false },
})
// Returns: { count: 5 }

// Atomic number operations
const incrementViews = await prisma.post.update({
  where: { id: 'post-uuid-123' },
  data: { views: { increment: 1 } },
})
```

## upsert - Insert or Update

Create a record if it doesn't exist, or update it if it does.

```typescript
const user = await prisma.user.upsert({
  where: { email: 'alice@prisma.io' },
  create: {
    email: 'alice@prisma.io',
    name: 'Alice',
  },
  update: {
    name: 'Alice (Updated)',
  },
})
```

## delete and deleteMany - Remove Records

Delete single or multiple records from the database.

```typescript
// Delete single record
const deletedUser = await prisma.user.delete({
  where: { email: 'alice@prisma.io' },
})

// Delete many records
const deletedPosts = await prisma.post.deleteMany({
  where: {
    published: false,
    createdAt: { lt: new Date('2023-01-01') },
  },
})
// Returns: { count: 10 }
```

## Filtering with Where Conditions

Use powerful filtering operators to query your data precisely.

```typescript
const filteredPosts = await prisma.post.findMany({
  where: {
    // String filters
    title: { contains: 'prisma', mode: 'insensitive' },

    // Comparison operators
    views: { gte: 100, lt: 1000 },

    // List membership
    status: { in: ['DRAFT', 'REVIEW'] },

    // Null checks
    content: { not: null },

    // Logical operators
    OR: [
      { published: true },
      { author: { role: 'ADMIN' } },
    ],
    AND: [
      { createdAt: { gte: new Date('2024-01-01') } },
      { createdAt: { lt: new Date('2024-12-31') } },
    ],
    NOT: { status: 'ARCHIVED' },

    // Relation filters
    author: {
      email: { endsWith: '@company.com' },
    },
    comments: {
      some: { approved: true },
      none: { spam: true },
    },
  },
})
```

## Transactions

Execute multiple operations atomically using transactions.

```typescript
// Sequential transaction with array
const [newUser, newPost] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'new@user.com', name: 'New User' } }),
  prisma.post.create({ data: { title: 'New Post', authorId: 'user-123' } }),
])

// Interactive transaction with callback
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id: 'user-123' } })

  if (!user) {
    throw new Error('User not found')
  }

  const post = await tx.post.create({
    data: {
      title: 'Transaction Post',
      authorId: user.id,
    },
  })

  await tx.user.update({
    where: { id: user.id },
    data: { postCount: { increment: 1 } },
  })

  return post
})

// Transaction with isolation level
const isolatedResult = await prisma.$transaction(
  async (tx) => {
    // ... transaction operations
  },
  { isolationLevel: 'Serializable', timeout: 10000 }
)
```

## Raw SQL Queries

Execute raw SQL when you need database-specific features or complex queries.

```typescript
// Tagged template query (safe from SQL injection)
const users = await prisma.$queryRaw`
  SELECT * FROM "User"
  WHERE email LIKE ${`%@company.com`}
  ORDER BY "createdAt" DESC
`

// Execute raw SQL (returns affected row count)
const affected = await prisma.$executeRaw`
  UPDATE "Post"
  SET published = true
  WHERE "authorId" = ${userId}
`

// Unsafe query (use with caution)
const tableName = 'User'
const results = await prisma.$queryRawUnsafe(
  `SELECT * FROM "${tableName}" LIMIT 10`
)
```

## Aggregations and Grouping

Perform aggregate calculations and group results.

```typescript
// Aggregate functions
const stats = await prisma.post.aggregate({
  _count: { id: true },
  _avg: { views: true },
  _sum: { views: true },
  _min: { createdAt: true },
  _max: { createdAt: true },
  where: { published: true },
})

// Count records
const postCount = await prisma.post.count({
  where: { published: true },
})

// Group by
const postsByAuthor = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { id: true },
  _avg: { views: true },
  having: {
    id: { _count: { gte: 5 } },
  },
  orderBy: { _count: { id: 'desc' } },
})
```

## Client Extensions

Extend Prisma Client with custom methods, computed fields, and query middleware.

```typescript
// Add computed fields to results
const xprisma = prisma.$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`
        },
      },
    },
  },
})

const user = await xprisma.user.findFirst()
console.log(user.fullName) // "John Doe"

// Add custom model methods
const xprisma = prisma.$extends({
  model: {
    user: {
      async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } })
      },
      async softDelete(id: string) {
        return prisma.user.update({
          where: { id },
          data: { deletedAt: new Date() },
        })
      },
    },
    $allModels: {
      async exists<T>(this: T, where: any): Promise<boolean> {
        const context = Prisma.getExtensionContext(this)
        const count = await (context as any).count({ where })
        return count > 0
      },
    },
  },
})

await xprisma.user.findByEmail('alice@prisma.io')
await xprisma.user.exists({ email: 'bob@prisma.io' })

// Query middleware for logging or modification
const xprisma = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const start = performance.now()
        const result = await query(args)
        const duration = performance.now() - start
        console.log(`${model}.${operation} took ${duration}ms`)
        return result
      },
    },
    user: {
      async findMany({ args, query }) {
        // Automatically exclude soft-deleted records
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
    },
  },
})
```

## Prisma CLI Commands

The Prisma CLI provides commands for schema management, migrations, and database operations. In Prisma ORM v7, these commands read the datasource from `prisma.config.ts`, so `schema.prisma` should not contain `url`, `directUrl`, or `shadowDatabaseUrl`.

```bash
# Initialize Prisma in a project
npx prisma init

# Generate Prisma Client from schema
npx prisma generate

# Create and apply migrations (development)
npx prisma migrate dev --name add_user_table

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (drops all data)
npx prisma migrate reset

# Push schema changes without migrations (prototyping)
npx prisma db push

# Pull schema from existing database
npx prisma db pull

# Open Prisma Studio GUI
npx prisma studio

# Validate schema syntax
npx prisma validate

# Format schema file
npx prisma format

# Start local Prisma Postgres server
npx prisma dev

# Seed database
npx prisma db seed
```

## Error Handling

Handle Prisma-specific errors with proper error codes.

```typescript
import { Prisma } from './generated/prisma/client'

try {
  await prisma.user.create({
    data: { email: 'duplicate@email.com', name: 'User' },
  })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      const field = error.meta?.target
      console.error(`Unique constraint failed on: ${field}`)
    }
    // Record not found
    if (error.code === 'P2025') {
      console.error('Record not found')
    }
    // Foreign key constraint failed
    if (error.code === 'P2003') {
      console.error('Foreign key constraint failed')
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error('Invalid query parameters')
  }
}
```

## Connection Management

Properly manage database connections in your application.

```typescript
// Singleton pattern for Prisma Client
import { PrismaClient } from './generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
```

## Summary

Prisma ORM excels at providing type-safe database access for Node.js and TypeScript applications. The primary use cases include building REST and GraphQL APIs, serverless functions, microservices, and full-stack applications where type safety and developer experience are priorities. Prisma's auto-generated client eliminates boilerplate code while catching errors at compile time rather than runtime.

For integration patterns, Prisma works seamlessly with popular frameworks like Next.js, Express, Fastify, NestJS, and Hono. The driver adapter architecture allows deployment to edge runtimes and serverless platforms including Vercel, Cloudflare Workers, and AWS Lambda. Extensions provide a powerful way to add business logic, logging, caching, and access control without modifying core queries. For high-traffic applications, Prisma integrates with connection poolers like PgBouncer and offers Prisma Accelerate for global edge caching and connection management.
