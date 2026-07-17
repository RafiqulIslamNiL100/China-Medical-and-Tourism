-- Remove "Breast Surgery" as a browsable specialty. It should no longer appear as
-- a treatment patients can search, filter by, or apply for anywhere on the site.
-- Scrubs it from the Specialty table, every hospital's specialtySlugs array, and
-- the FAH-XJTU rich profile narrative (department tables + the specialty summary
-- list) so no public page still names it. Safe to re-run: DELETE/array_remove are
-- no-ops once applied, and each replace() is guarded by a LIKE check.

DELETE FROM "Specialty" WHERE "slug" = 'breast-surgery';

UPDATE "Hospital"
SET "specialtySlugs" = array_remove("specialtySlugs", 'breast-surgery')
WHERE 'breast-surgery' = ANY("specialtySlugs");

UPDATE "Hospital"
SET "richProfileMarkdown" = replace(
  "richProfileMarkdown",
  'Otolaryngology-Head and Neck Surgery, Breast Surgery, Rheumatology',
  'Otolaryngology-Head and Neck Surgery, Rheumatology'
)
WHERE "richProfileMarkdown" LIKE '%Breast Surgery%';

UPDATE "Hospital"
SET "richProfileMarkdown" = replace(
  "richProfileMarkdown",
  '| Department of Breast Surgery | Specializes in diagnosis and surgical treatment of benign and malignant breast tumors. |
',
  ''
)
WHERE "richProfileMarkdown" LIKE '%Breast Surgery%';

UPDATE "Hospital"
SET "richProfileMarkdown" = replace(
  "richProfileMarkdown",
  '| Department of Breast Surgery | Specializes in diagnosis and surgical treatment of breast tumors. |
',
  ''
)
WHERE "richProfileMarkdown" LIKE '%Breast Surgery%';

UPDATE "Hospital"
SET "richProfileMarkdown" = replace(
  "richProfileMarkdown",
  'Specializes in gastrointestinal, thyroid, and breast surgeries.',
  'Specializes in gastrointestinal and thyroid surgeries.'
)
WHERE "richProfileMarkdown" LIKE '%breast surgeries%';

UPDATE "Hospital"
SET "richProfileMarkdown" = replace(
  "richProfileMarkdown",
  'Specializes in surgical treatment of lung cancer, gastrointestinal cancer, and breast cancer.',
  'Specializes in surgical treatment of lung cancer and gastrointestinal cancer.'
)
WHERE "richProfileMarkdown" LIKE '%breast cancer%';
