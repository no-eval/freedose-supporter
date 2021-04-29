-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "boothSelfie" SET DATA TYPE TEXT,
ALTER COLUMN "paymentProof" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "selfie" SET DATA TYPE TEXT,
ALTER COLUMN "idCard" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Supporter" ALTER COLUMN "selfie" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Vaccination" ALTER COLUMN "certificate" SET DATA TYPE TEXT,
ALTER COLUMN "receipt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Volunteer" ALTER COLUMN "selfie" SET DATA TYPE TEXT;