-- Create sequence for Tribunal auto-increment
CREATE SEQUENCE "Tribunal_id_seq";
ALTER TABLE "Tribunal" ALTER COLUMN "id" SET DEFAULT nextval('"Tribunal_id_seq"');
ALTER SEQUENCE "Tribunal_id_seq" OWNED BY "Tribunal"."id";
