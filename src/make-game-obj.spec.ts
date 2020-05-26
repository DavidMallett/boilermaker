import * as fs from "fs";
import test from "jest";
import { ClassOutline, generateClassBoilerplate } from "./class";

const gameObjProps: string[][] = [
    ["id", "string"],
    ["name", "string"],
    ["ownerId", "string"],
    ["text", "string"],
    ["typeLine", "string"],
    ["types", "string[]"],
    ["keywords", "string[]"],
    ["power", "number"],
    ["toughness", "number"],
    ["damage", "number"],
    ["manaCost", "string"],
    ["cmc", "number"],
    ["colors", "string[]"]
];

it("should generate MTG GameObject boilerplate", () => {
    const text: string = generateClassBoilerplate("GameObj", gameObjProps);

    console.log(text);

    expect(text).toBeTruthy();

    fs.writeFileSync(`./gameObjOutput.ts`, text, {
        encoding: "utf8",
        flag: "w+",
        mode: 0o666
    });
    
});

const gameStateProps: string[][] = [
    ["turn", "number"],
    ["step", "string"],
    ["phase", "string"],
    ["stormCount", "number"],
    ["events", "EventEmitter"],
    ["stateBasedEffects", "StaticEffect[]"],
    ["pilot", "Pilot"],
    ["opponent", "PilotProps"],
    ["currentStack", "any[]"]
];

it("should generate MTG GameState boilerplate", function() {
    const text: string = generateClassBoilerplate("GameState", gameStateProps);

    console.log(text);

    
    fs.writeFileSync(`./gameStateOutput.ts`, text, {
        encoding: "utf8",
        flag: "w+",
        mode: 0o666
    });

    expect(text).toBeTruthy();
})
