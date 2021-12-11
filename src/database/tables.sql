CREATE TABLE "questions" (
	"id" serial NOT NULL,
	"question" TEXT NOT NULL,
	"student_id" int NOT NULL,
	"sumit_at" timestamp with time zone NOT NULL DEFAULT 'now()',
	"answer" TEXT,
	CONSTRAINT "questions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE ".users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"class" char(3) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "tags" (
	"id" serial NOT NULL,
	"text" TEXT NOT NULL,
	CONSTRAINT "tags_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "questions_tags" (
	"id" serial NOT NULL,
	"tag_id" int NOT NULL,
	"question_id" int NOT NULL,
	CONSTRAINT "questions_tags_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "questions" ADD CONSTRAINT "questions_fk0" FOREIGN KEY ("student_id") REFERENCES "users"("id");



ALTER TABLE "questions_tags" ADD CONSTRAINT "questions_tags_fk0" FOREIGN KEY ("tag_id") REFERENCES "tags"("id");
ALTER TABLE "questions_tags" ADD CONSTRAINT "questions_tags_fk1" FOREIGN KEY ("question_id") REFERENCES "questions"("id");




