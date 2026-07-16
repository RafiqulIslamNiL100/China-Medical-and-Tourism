-- The FAH-XJTU seed migration inserted the hospital with placeholder rating/reviewCount
-- (0, 0). Set the real figures now that they're known. Scoped to this one row by slug
-- and safe to re-run (idempotent no-op once applied).
UPDATE "Hospital"
SET "rating" = 4.9, "reviewCount" = 259
WHERE "slug" = 'first-affiliated-hospital-xjtu';
