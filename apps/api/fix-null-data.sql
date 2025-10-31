-- Fix NULL values in array columns before applying schema migration
-- Run this in Neon Console SQL Editor before running npm run db:push

-- Fix Product table
UPDATE "Product" 
SET keywords = '{}' 
WHERE keywords IS NULL;

UPDATE "Product" 
SET images = '{}' 
WHERE images IS NULL;

-- Fix Blog table
UPDATE "Blog" 
SET categories = '{}' 
WHERE categories IS NULL;

UPDATE "Blog" 
SET keywords = '{}' 
WHERE keywords IS NULL;

-- Verify the fix
SELECT 
    'Product' as table_name,
    COUNT(*) as total_rows,
    COUNT(keywords) as non_null_keywords,
    COUNT(images) as non_null_images
FROM "Product"
UNION ALL
SELECT 
    'Blog' as table_name,
    COUNT(*) as total_rows,
    COUNT(categories) as non_null_categories,
    COUNT(keywords) as non_null_keywords
FROM "Blog";

