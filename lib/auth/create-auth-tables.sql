-- Create Account table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Account" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE
);

-- Create Session table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE
);

-- Create VerificationToken table if it doesn't exist
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE (identifier, token)
);

-- Add emailVerified column to User table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'User' AND column_name = 'emailVerified'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP;
  END IF;
END $$;
