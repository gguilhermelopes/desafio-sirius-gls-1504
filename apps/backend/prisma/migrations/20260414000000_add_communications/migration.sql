-- CreateTable
CREATE TABLE "Tribunal" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tribunal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Process" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "className" TEXT,
    "classCode" TEXT,
    "tribunalId" INTEGER NOT NULL,
    "hasTransitado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Communication" (
    "id" TEXT NOT NULL,
    "pjeId" INTEGER NOT NULL,
    "processId" TEXT NOT NULL,
    "publicationDate" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "organName" TEXT,
    "medium" TEXT,
    "link" TEXT,
    "documentType" TEXT,
    "communicationNumber" INTEGER,
    "hash" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "aiSummary" TEXT,
    "aiSummaryGeneratedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipient" (
    "id" TEXT NOT NULL,
    "communicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "role" TEXT,
    "oabNumber" TEXT,
    "oabState" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "recordsFetched" INTEGER NOT NULL DEFAULT 0,
    "recordsSaved" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tribunal_sigla_key" ON "Tribunal"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "Process_number_key" ON "Process"("number");

-- CreateIndex
CREATE INDEX "Process_tribunalId_idx" ON "Process"("tribunalId");

-- CreateIndex
CREATE UNIQUE INDEX "Communication_pjeId_key" ON "Communication"("pjeId");

-- CreateIndex
CREATE UNIQUE INDEX "Communication_hash_key" ON "Communication"("hash");

-- CreateIndex
CREATE INDEX "Communication_processId_idx" ON "Communication"("processId");

-- CreateIndex
CREATE INDEX "Communication_publicationDate_idx" ON "Communication"("publicationDate");

-- CreateIndex
CREATE INDEX "Recipient_communicationId_idx" ON "Recipient"("communicationId");

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_tribunalId_fkey" FOREIGN KEY ("tribunalId") REFERENCES "Tribunal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Communication" ADD CONSTRAINT "Communication_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_communicationId_fkey" FOREIGN KEY ("communicationId") REFERENCES "Communication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
