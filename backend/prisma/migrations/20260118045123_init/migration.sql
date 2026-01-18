-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'citizen',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "farmerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "variety" TEXT NOT NULL,
    "plantingDate" DATETIME,
    "expectedHarvestDate" DATETIME,
    "status" TEXT,
    "locationLat" REAL,
    "locationLon" REAL,
    "imageUrl" TEXT,
    CONSTRAINT "Crop_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "farmerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pricePerKg" REAL,
    "availableQuantity" REAL,
    "imageUrl" TEXT,
    "isOrganic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalysisLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cropId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "aiDiagnosis" TEXT,
    "recommendation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalysisLog_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
