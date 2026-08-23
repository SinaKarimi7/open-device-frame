import { readFile } from "node:fs/promises";
import path from "node:path";
import { readDevices, root } from "../catalog/shared.mjs";
const errors=[];for(const d of await readDevices())try{const svg=await readFile(path.join(root,"public",d.images.frontOff),"utf8");if(!svg.includes("<svg")||!svg.includes("viewBox"))errors.push(`${d.id}: invalid SVG`);if(Buffer.byteLength(svg)>100000)errors.push(`${d.id}: image exceeds 100KB`)}catch{errors.push(`${d.id}: unreadable image`)}if(errors.length){console.error(errors.join("\n"));process.exitCode=1}else console.log("Image validation passed.");
