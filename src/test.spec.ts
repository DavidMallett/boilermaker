import test from "jest";
import { ClassOutline, generateClassBoilerplate } from "./class";

it("should generate correctly formatted class boilerplate", () => {
    const abc: string = "qwertyuiopasdfghjklzxcvbnm";
    const nameLength = 5;
    let name: string = "";
    for (let i: number = 0; i < nameLength; i++) {
        let random: string = abc.charAt(Math.random() * abc.length);
        if (i === 0) {
            random = random.toUpperCase();
        }
        name += random;
    }
    let boiler: string = generateClassBoilerplate(name + "Class", [["foo", "string"], ["bar", "number"]]);

    console.log(boiler);

    expect(boiler).toBeTruthy();

});
