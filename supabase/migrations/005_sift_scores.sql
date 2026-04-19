-- SIFT: Sifting Intelligence for Trust
-- AI-powered content relevance scoring for social_items

alter table social_items
  add column if not exists sift_score smallint,
  add column if not exists sift_tag text,
  add column if not exists sift_reason text,
  add column if not exists sift_scored_at timestamptz;

create index if not exists idx_social_items_sift_score
  on social_items (sift_score desc nulls last);
