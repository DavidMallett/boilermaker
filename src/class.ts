import * as fs from "fs";

export interface ClassOutline {
  name: string;
  properties: string[];
  defaultVals: string[]; // optional 3rd value in each sub-array
}

/**
 * Outline.properties: [
 *  ["name", "string", "David"],
 *  ["age", "number", 18],
 *  ["gender", "m" | "f" | "o"] // optional default omitted
 * ]
 */
export class MyClass {
  private name: string;
  private age: number;
  private myEnum: "m" | "f" | "o";
  private myBool?: boolean;

  public constructor(n: string, a: number, g: "m" | "f" | "o") {
    this.name = n;
    this.age = a;
    this.myEnum = g;
  }

}

/**
 * 
 * @param name 
 * @param props 
 */
export function generateClassBoilerplate(name: string, props: string[][], runTest: boolean = false): string {
    let tabs: number = 1;
    let result: string = `export class ${name} {\n` + "\t".repeat(tabs);
    let interf: string = `export interface ${name}Config {\n` + "\t".repeat(tabs);
    let functions: string[] = [];
    let configInterface: any = {};
    let constructorFn: string = `public constructor(config: ${name}Config) {\n` + `\t`.repeat(tabs + 1);

    let docs: string[] = [];
    let unitTests: string[] = [];

    let testImports: string = `import test from "jest";\nimport { ${name}, ${name}Config } from "./${name}";\n\n`;
    let testValues: any[] = [];
    let testValuesStr: string[] = [];
    let testFn: string = `it("should test the ${name} class constructor and getter/setter methods", () => {\n` + `\t`.repeat(tabs);
    let testSetup: string = `const config: ${name}Config = {`; // + "\t".repeat(tabs + 1);
    let assertions: string[] = [];

    // tabs++;
    props.forEach((col, index, arr) => {
        let p: string = col[0];
        let upper: string = p.charAt(0).toUpperCase() + p.slice(1);
        Object.assign(configInterface, { p: col[1] });
        result += `private ${p}: ${col[1]};\n` + ("\t").repeat(tabs);
        interf += `${p}: ${col[1]};\n` + `\t`.repeat(tabs);
        constructorFn += `this.${p} = config.${p};\n` + `\t`.repeat(tabs + 1);
        
        let getterDoc: string = "/**\n" + "\t".repeat(tabs) + ` * @returns {${col[1]}} ${p}\n` + `\t`.repeat(tabs) + ` */`;
        let getter: string = `public get${upper}(): ${col[1]} {\n` + `\t`.repeat(tabs + 1) + `return this.${col[0]};\n` + `\t`.repeat(tabs) + `}`;

        // functions.push(`public get${upper}(): ${col[1]} {\n` + `\t`.repeat(tabs + 1) + `return this.${col[0]};\n` + `\t`.repeat(tabs) + `}`);
        functions.push(getterDoc + "\n" + "\t".repeat(tabs) + getter);

        let setterDoc: string = "/**\n" + "\t".repeat(tabs) + ` * @param {${col[1]}} ${p}\n` + `\t`.repeat(tabs) + ` */`;
        let setter: string = `public set${upper}(v: ${col[1]}): void {\n` + `\t`.repeat(tabs + 1) + `this.${col[0]} = v;\n` + `\t`.repeat(tabs) + `}`;
        functions.push(setterDoc + "\n" + "\t".repeat(tabs) + setter);

        // col[2], if provided, should be the default value to set using the constructor
        if (col[2]) {
            configInterface[p] = col[2];
            testValues.push(col[2]);
            testValuesStr.push(`const default${upper}: ${col[1]} = ${JSON.stringify(col[2])};\n`);
            testSetup += `\n` + `\t`.repeat(tabs) + `"${p}": default${upper},`;
            assertions.push(`expect(config[${p}]).toBeTruthy();`);
            assertions.push(`expect(config[${p}]).toBe(${JSON.stringify(col[2])});`);
            assertions.push(`expect(result[${p}]).toBeTruthy();`);
            assertions.push(`expect(result[${p}]).toBe(${JSON.stringify(col[2])});`);
        }

        let placeholder = "\n" + "\t".repeat(tabs + 1) + "\n";
        let getterTest: string = `it("should test the get${upper} method", () => {})`

        // functions.push(`public set${upper}(v: ${col[1]}): void {\n` + `\t`.repeat(tabs + 1) + `this.${col[0]} = v;\n` + `\t`.repeat(tabs) + `}`);
    });

    interf += `\n}`;
    constructorFn += `\n\t}`;
    testSetup += "\n};"

    testImports += testSetup;

    testFn += `const result = new ${name}(config);`

    testValuesStr.forEach((valueStr, index, arr) => {
        testImports += valueStr;
        
    })


    // result += `public constructor(config: ${name}Config}) {\n` + `\t`.repeat(tabs + 1) + `}\n` + `\t`.repeat(tabs);

    result += `\n\n\t${constructorFn}\n\n` + `\t`.repeat(tabs);

    // work tbd to construct all the properties, their getters/setters/accessors, and inline docs

    functions.forEach((func, index, arr) => {
        result += func + "\n\n" + "\t".repeat(tabs);
    });
    // tabs--;

    // work to add the functions to the rest of the class file

    result += "\n}\n";

    let final = interf + "\n\n" + result; 
    final = final.replace("\t", "  ");
    // writing of the file(s)

    // fs.writeFileSync(`./${name}.ts`, final, {
    //     encoding: "utf8",
    //     flag: "w+",
    //     mode: 0o666
    // });

    return final;
}
