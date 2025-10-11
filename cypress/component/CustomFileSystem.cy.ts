import { CustomFileSystem, CustomFileSystemNode } from "../../src/types";

describe("CustomFileSystem Unit Tests", () => {
  let fileSystem: CustomFileSystem;

  beforeEach(() => {
    // Initialize a fresh file system instance before each test
    fileSystem = new CustomFileSystem();
  });

  describe("Constructor and Initial State", () => {
    it("should initialize with a root directory", () => {
      expect(fileSystem.root).to.exist;
      expect(fileSystem.root.name).to.equal("~");
      expect(fileSystem.root.type).to.equal("directory");
      expect(fileSystem.root.path).to.equal("/");
      expect(fileSystem.root.children).to.be.an("array").that.is.empty;
    });

    it("should set current path to root initially", () => {
      expect(fileSystem.currentPath).to.equal("/");
    });
  });

  describe("getNodeByPath", () => {
    beforeEach(() => {
      // Set up a test file structure
      fileSystem.root.children = [
        {
          name: "documents",
          type: "directory",
          path: "/documents",
          children: [
            {
              name: "file1.txt",
              type: "file",
              path: "/documents/file1.txt",
              content: "Content of file1",
            },
            {
              name: "subfolder",
              type: "directory",
              path: "/documents/subfolder",
              children: [
                {
                  name: "file2.txt",
                  type: "file",
                  path: "/documents/subfolder/file2.txt",
                  content: "Content of file2",
                },
              ],
            },
          ],
        },
        {
          name: "readme.txt",
          type: "file",
          path: "/readme.txt",
          content: "This is a readme file",
        },
      ];
    });

    it('should return root for "/" and "~" paths', () => {
      const rootBySlash = fileSystem.getNodeByPath("/");
      const rootByTilde = fileSystem.getNodeByPath("~");

      expect(rootBySlash).to.equal(fileSystem.root);
      expect(rootByTilde).to.equal(fileSystem.root);
    });

    it("should find files in root directory", () => {
      const readmeNode = fileSystem.getNodeByPath("~/readme.txt");

      expect(readmeNode).to.exist;
      expect(readmeNode!.name).to.equal("readme.txt");
      expect(readmeNode!.type).to.equal("file");
      expect(readmeNode!.content).to.equal("This is a readme file");
    });

    it("should find directories", () => {
      const documentsNode = fileSystem.getNodeByPath("~/documents");

      expect(documentsNode).to.exist;
      expect(documentsNode!.name).to.equal("documents");
      expect(documentsNode!.type).to.equal("directory");
      expect(documentsNode!.children).to.have.length(2);
    });

    it("should find nested files", () => {
      const nestedFile = fileSystem.getNodeByPath("~/documents/file1.txt");

      expect(nestedFile).to.exist;
      expect(nestedFile!.name).to.equal("file1.txt");
      expect(nestedFile!.type).to.equal("file");
      expect(nestedFile!.content).to.equal("Content of file1");
    });

    it("should find deeply nested files", () => {
      const deepFile = fileSystem.getNodeByPath(
        "~/documents/subfolder/file2.txt"
      );

      expect(deepFile).to.exist;
      expect(deepFile!.name).to.equal("file2.txt");
      expect(deepFile!.content).to.equal("Content of file2");
    });

    it("should return null for non-existent paths", () => {
      const nonExistent = fileSystem.getNodeByPath("~/nonexistent.txt");
      expect(nonExistent).to.be.null;
    });

    it("should return null for non-existent nested paths", () => {
      const nonExistent = fileSystem.getNodeByPath(
        "~/documents/nonexistent/file.txt"
      );
      expect(nonExistent).to.be.null;
    });
  });

  describe("getNodeType", () => {
    beforeEach(() => {
      fileSystem.root.children = [
        {
          name: "test.txt",
          type: "file",
          path: "/test.txt",
          content: "test content",
        },
        {
          name: "testdir",
          type: "directory",
          path: "/testdir",
          children: [],
        },
      ];
    });

    it('should return "file" for file nodes', () => {
      const fileNode = fileSystem.getNodeByPath("~/test.txt");
      const nodeType = fileSystem.getNodeType(fileNode);
      expect(nodeType).to.equal("file");
    });

    it('should return "directory" for directory nodes', () => {
      const dirNode = fileSystem.getNodeByPath("~/testdir");
      const nodeType = fileSystem.getNodeType(dirNode);
      expect(nodeType).to.equal("directory");
    });

    it('should return "not found" for null nodes', () => {
      const nodeType = fileSystem.getNodeType(null);
      expect(nodeType).to.equal("not found");
    });
  });

  describe("readFile", () => {
    beforeEach(() => {
      fileSystem.root.children = [
        {
          name: "sample.txt",
          type: "file",
          path: "/sample.txt",
          content: "Hello, World!",
        },
        {
          name: "empty.txt",
          type: "file",
          path: "/empty.txt",
          content: "",
        },
        {
          name: "folder",
          type: "directory",
          path: "/folder",
          children: [],
        },
      ];
    });

    it("should read file content successfully", () => {
      const content = fileSystem.readFile("~/sample.txt");
      expect(content).to.equal("Hello, World!");
    });

    it("should return empty string for empty files", () => {
      const content = fileSystem.readFile("~/empty.txt");
      expect(content).to.equal("");
    });

    it("should return null for directories", () => {
      const content = fileSystem.readFile("~/folder");
      expect(content).to.be.null;
    });

    it("should return null for non-existent files", () => {
      const content = fileSystem.readFile("~/nonexistent.txt");
      expect(content).to.be.null;
    });

    it("should handle files without content property", () => {
      fileSystem.root.children!.push({
        name: "nocontent.txt",
        type: "file",
        path: "/nocontent.txt",
        // No content property
      });

      const content = fileSystem.readFile("~/nocontent.txt");
      expect(content).to.equal("");
    });
  });

  describe("listDirectory", () => {
    beforeEach(() => {
      const children: CustomFileSystemNode[] = [
        {
          name: "file1.txt",
          type: "file",
          path: "/file1.txt",
          content: "content1",
        },
        {
          name: "file2.txt",
          type: "file",
          path: "/file2.txt",
          content: "content2",
        },
        {
          name: "subdirectory",
          type: "directory",
          path: "/subdirectory",
          children: [
            {
              name: "nested.txt",
              type: "file",
              path: "/subdirectory/nested.txt",
              content: "nested content",
            },
          ],
        },
        {
          name: "emptydir",
          type: "directory",
          path: "/emptydir",
          children: [],
        },
      ];
      fileSystem.root.children = children;
    });

    it("should list root directory contents", () => {
      const contents = fileSystem.listDirectory("~/");
      expect(contents).to.deep.equal([
        "file1.txt",
        "file2.txt",
        "subdirectory",
        "emptydir",
      ]);
    });

    it("should list subdirectory contents", () => {
      const contents = fileSystem.listDirectory("~/subdirectory");
      expect(contents).to.deep.equal(["nested.txt"]);
    });

    it("should return empty array for empty directories", () => {
      const contents = fileSystem.listDirectory("~/emptydir");
      expect(contents).to.deep.equal([]);
    });

    it("should return null for files", () => {
      const contents = fileSystem.listDirectory("~/file1.txt");
      expect(contents).to.be.null;
    });

    it("should return null for non-existent paths", () => {
      const contents = fileSystem.listDirectory("~/nonexistent");
      expect(contents).to.be.null;
    });
  });

  describe("changeDirectory", () => {
    beforeEach(() => {
      fileSystem.root.children = [
        {
          name: "documents",
          type: "directory",
          path: "/documents",
          children: [
            {
              name: "projects",
              type: "directory",
              path: "/documents/projects",
              children: [],
            },
          ],
        },
        {
          name: "file.txt",
          type: "file",
          path: "/file.txt",
          content: "content",
        },
      ];
    });

    it("should change to valid directory", () => {
      const success = fileSystem.changeDirectory("~/documents");
      expect(success).to.be.true;
      expect(fileSystem.currentPath).to.equal("~/documents");
    });

    it("should change to nested directory", () => {
      const success = fileSystem.changeDirectory("~/documents/projects");
      expect(success).to.be.true;
      expect(fileSystem.currentPath).to.equal("~/documents/projects");
    });

    it("should change to root directory", () => {
      // First change to a subdirectory
      fileSystem.changeDirectory("~/documents");

      // Then change back to root
      const success = fileSystem.changeDirectory("~/");
      expect(success).to.be.true;
      expect(fileSystem.currentPath).to.equal("~/");
    });

    it("should fail to change to file", () => {
      const success = fileSystem.changeDirectory("~/file.txt");
      expect(success).to.be.false;
      expect(fileSystem.currentPath).to.equal("/"); // Should remain unchanged
    });

    it("should fail to change to non-existent directory", () => {
      const success = fileSystem.changeDirectory("~/nonexistent");
      expect(success).to.be.false;
      expect(fileSystem.currentPath).to.equal("/"); // Should remain unchanged
    });
  });

  describe("Add Directory", () => {
    beforeEach(() => {
      fileSystem.root.children = [
        {
          name: "existing",
          type: "directory",
          path: "/existing/",
          children: [],
        },
      ];
    });

    it("should add a new directory to root", () => {
      const success = fileSystem.addDirectory("~/", "newdir");
      expect(success).to.be.true;
      expect(fileSystem.root.children).to.deep.include({
        name: "newdir",
        type: "directory",
        children: [],
        path: "/newdir/",
      });
    });

    it("should add a new directory to an existing directory", () => {
      const success = fileSystem.addDirectory("~/existing", "subdir");
      expect(success).to.be.true;
      expect(fileSystem.getNodeByPath("~/existing/subdir")).to.deep.include({
        name: "subdir",
        type: "directory",
        children: [],
        path: "/existing/subdir/",
      });
    });

    it("should fail to add a directory to a file path", () => {
      // First add a file to root
      fileSystem.root.children!.push({
        name: "afile.txt",
        type: "file",
        path: "/afile.txt",
        content: "file content",
      });
      const success = fileSystem.addDirectory("~/afile.txt", "subdir");
      expect(success).to.be.false;
    });

    it("should fail to add a directory to a non-existent path", () => {
      const success = fileSystem.addDirectory("~/nonexistent", "subdir");
      expect(success).to.be.false;
    });

    it("should add a new directory to a just created directory", () => {
      const success1 = fileSystem.addDirectory("~/", "parentdir");
      expect(success1).to.be.true;

      const success2 = fileSystem.addDirectory("~/parentdir", "childdir");
      expect(success2).to.be.true;

      expect(fileSystem.getNodeByPath("~/parentdir/childdir")).to.deep.include({
        name: "childdir",
        type: "directory",
        children: [],
        path: "/parentdir/childdir/",
      });
    });

    it("should fail to add a directory with invalid parent path", () => {
      const success = fileSystem.addDirectory("invalidpath", "subdir");
      expect(success).to.be.false;
    });
  });

  describe("Integration Tests", () => {
    it("should handle complex file system operations", () => {
      // Create a complex file structure
      fileSystem.root.children = [
        {
          name: "home",
          type: "directory",
          path: "/home",
          children: [
            {
              name: "user",
              type: "directory",
              path: "/home/user",
              children: [
                {
                  name: "documents",
                  type: "directory",
                  path: "/home/user/documents",
                  children: [
                    {
                      name: "project.txt",
                      type: "file",
                      path: "/home/user/documents/project.txt",
                      content: "Project details",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      // Test navigation and file operations
      expect(fileSystem.changeDirectory("~/home/user")).to.be.true;
      expect(fileSystem.listDirectory("~/home/user")).to.deep.equal([
        "documents",
      ]);
      expect(fileSystem.readFile("~/home/user/documents/project.txt")).to.equal(
        "Project details"
      );
      expect(
        fileSystem.getNodeType(
          fileSystem.getNodeByPath("~/home/user/documents")
        )
      ).to.equal("directory");
    });
  });
});
