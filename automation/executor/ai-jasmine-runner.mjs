import Jasmine from "jasmine";
import path from "path";

const file = path.resolve(process.argv[2]);
const description = process.argv[3];

const jasmine = new Jasmine({});
jasmine.exitOnCompletion = false;

await jasmine.loadConfigFile("jasmine.mjs");

jasmine.env.configure({
    random: false,
    specFilter: spec => spec.description === description
});

const result = await jasmine.execute([file]);

process.exitCode = result.overallStatus === "passed" ? 0 : 1;
