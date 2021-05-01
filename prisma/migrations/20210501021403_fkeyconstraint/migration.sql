/*
  Warnings:

  - Added the required column `participantId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supporterId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaccinationId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantId` to the `Vaccination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaccinationId` to the `VaccinationVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `VaccinationVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifiedById` to the `VaccinationVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_id_fkey1";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_id_fkey2";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_id_fkey";

-- DropForeignKey
ALTER TABLE "Vaccination" DROP CONSTRAINT "Vaccination_id_fkey";

-- DropForeignKey
ALTER TABLE "VaccinationVerification" DROP CONSTRAINT "VaccinationVerification_id_fkey2";

-- DropForeignKey
ALTER TABLE "VaccinationVerification" DROP CONSTRAINT "VaccinationVerification_id_fkey";

-- DropForeignKey
ALTER TABLE "VaccinationVerification" DROP CONSTRAINT "VaccinationVerification_id_fkey1";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "participantId" UUID NOT NULL,
ADD COLUMN     "supporterId" UUID NOT NULL,
ADD COLUMN     "vaccinationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Vaccination" ADD COLUMN     "participantId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "VaccinationVerification" ADD COLUMN     "vaccinationId" UUID NOT NULL,
ADD COLUMN     "matchId" UUID NOT NULL,
ADD COLUMN     "verifiedById" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD FOREIGN KEY ("supporterId") REFERENCES "Supporter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD FOREIGN KEY ("vaccinationId") REFERENCES "Vaccination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationVerification" ADD FOREIGN KEY ("vaccinationId") REFERENCES "Vaccination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationVerification" ADD FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationVerification" ADD FOREIGN KEY ("verifiedById") REFERENCES "Volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
