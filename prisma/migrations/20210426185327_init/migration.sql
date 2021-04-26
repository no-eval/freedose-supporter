-- CreateEnum
CREATE TYPE "DosesRecieved" AS ENUM ('ZERO', 'ONE', 'TWO');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('UPI', 'BANK');

-- CreateEnum
CREATE TYPE "RevokedReason" AS ENUM ('PARTICIPANT_DELAYED', 'SUPPORTER_DELAYED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING_VACCINATION', 'PENDING_PAYMENT', 'REMATCHING', 'PAID');

-- CreateEnum
CREATE TYPE "VaccinationDose" AS ENUM ('FIRST', 'SECOND');

-- CreateEnum
CREATE TYPE "VaccinationProgress" AS ENUM ('REGISTERED', 'VACCINATED');

-- CreateEnum
CREATE TYPE "Vaccine" AS ENUM ('COVISHIELD', 'COVAXIN', 'SPUTNIKV');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "Supporter" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "dosesPledged" INTEGER NOT NULL DEFAULT 0,
    "dosesFulfilled" INTEGER NOT NULL DEFAULT 0,
    "socialUrl" VARCHAR(50),
    "phone" BIGINT,
    "selfie" BYTEA,
    "joinedAt" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50),
    "phone" BIGINT NOT NULL,
    "pincode" INTEGER,
    "birthYear" INTEGER,
    "selfie" BYTEA,
    "idCard" BYTEA,
    "dosesRecieved" "DosesRecieved" NOT NULL,
    "paymentMode" "PaymentMode",
    "upiId" VARCHAR(20),
    "accountNumber" VARCHAR(20),
    "ifsc" VARCHAR(20),
    "joinedAt" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" UUID NOT NULL,
    "matchedAt" TIMESTAMPTZ NOT NULL,
    "acknowledgedAt" TIMESTAMPTZ,
    "matchRevoked" BOOLEAN,
    "revokedReason" "RevokedReason",
    "boothSelfie" BYTEA,
    "selfiePrivacy" BOOLEAN,
    "thankyouNote" VARCHAR(255),
    "status" "MatchStatus",
    "paymentProof" BYTEA,
    "paymentAmount" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" UUID NOT NULL,
    "registeredAt" TIMESTAMPTZ NOT NULL,
    "dose" "VaccinationDose" NOT NULL,
    "progress" "VaccinationProgress" NOT NULL,
    "vaccine" "Vaccine",
    "vaccinatedDate" DATE,
    "vaccinatedEntryDate" TIMESTAMPTZ,
    "certificate" BYTEA,
    "receipt" BYTEA,
    "receiptAmount" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaccinationVerification" (
    "id" UUID NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "verifiedAt" TIMESTAMPTZ NOT NULL,
    "rejectedReason" VARCHAR(255),
    "rejectedAt" TIMESTAMPTZ,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" BIGINT NOT NULL,
    "selfie" BYTEA,
    "isVerified" BOOLEAN NOT NULL,
    "joinedAt" TIMESTAMPTZ,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supporter.email_unique" ON "Supporter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant.phone_unique" ON "Participant"("phone");

-- AddForeignKey
ALTER TABLE "Match" ADD FOREIGN KEY ("id") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD FOREIGN KEY ("id") REFERENCES "Supporter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD FOREIGN KEY ("id") REFERENCES "Vaccination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD FOREIGN KEY ("id") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationVerification" ADD FOREIGN KEY ("id") REFERENCES "Vaccination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationVerification" ADD FOREIGN KEY ("id") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationVerification" ADD FOREIGN KEY ("id") REFERENCES "Volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
