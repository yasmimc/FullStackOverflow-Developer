CREATE TABLE "questions" (
	"id" serial NOT NULL,
	"question" TEXT NOT NULL,
	"submit_at" timestamp NOT NULL DEFAULT 'now()',
	"student_name" TEXT NOT NULL,
	"student_class" char(3) NOT NULL,
	"answered" bool NOT NULL DEFAULT 'false',
	CONSTRAINT "questions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"class" char(3) NOT NULL,
	"token" uuid NOT NULL,
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



CREATE TABLE "answers" (
	"id" serial NOT NULL,
	"question_id" int NOT NULL,
	"answered_by" int NOT NULL,
	"answer" TEXT NOT NULL,
	"answered_at" timestamp with time zone NOT NULL DEFAULT 'now()',
	CONSTRAINT "answers_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);






ALTER TABLE "questions_tags" ADD CONSTRAINT "questions_tags_fk0" FOREIGN KEY ("tag_id") REFERENCES "tags"("id");
ALTER TABLE "questions_tags" ADD CONSTRAINT "questions_tags_fk1" FOREIGN KEY ("question_id") REFERENCES "questions"("id");

ALTER TABLE "answers" ADD CONSTRAINT "answers_fk0" FOREIGN KEY ("question_id") REFERENCES "questions"("id");
ALTER TABLE "answers" ADD CONSTRAINT "answers_fk1" FOREIGN KEY ("answered_by") REFERENCES "users"("id");





