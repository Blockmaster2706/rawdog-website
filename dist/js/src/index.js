import { CustomFileSystem } from "./types.js";
window.CustomFileSystem = CustomFileSystem;
window.testFS = new CustomFileSystem();
window.testFS.children = [
    {
        type: "file",
        name: "file1.txt",
        content: "This is the content of file1.txt",
    },
    {
        type: "file",
        name: "file2.txt",
        content: "This is the content of file2.txt",
    },
];
console.log("CustomFileSystem initialized with test files.");
//# sourceMappingURL=index.js.map