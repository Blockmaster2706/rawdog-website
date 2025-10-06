import { CustomFileSystem } from "./types.js";

(window as any).CustomFileSystem = CustomFileSystem;
(window as any).testFS = new CustomFileSystem();