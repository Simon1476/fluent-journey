// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { parse } from "csv-parse";

const prisma = new PrismaClient();

interface WordRecord {
  english: string;
  korean: string;
  level: "elementary" | "intermediate" | "advanced";
}

async function main() {
  const records: WordRecord[] = [];

  const parser = fs.createReadStream("prisma/english-word-3000.csv").pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  });

  await new Promise((resolve) => {
    parser.on("end", async function () {
      for (const record of records) {
        await prisma.word.create({
          data: {
            english: record.english,
            korean: record.korean,
            level: record.level,
          },
        });
      }
      // await prisma.word.createMany({
      //   data: records.map(record => ({
      //     english: record.english,
      //     korean: record.korean,
      //     level: record.level,
      //   })),
      // });
      resolve(true);
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
