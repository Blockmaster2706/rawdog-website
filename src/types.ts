export type CustomFileSystemNode = {
    name: string;
    type: 'file' | 'directory';
    content?: string;
    children?: CustomFileSystemNode[];
    path: string;
};

export class CustomFileSystem {
    root: CustomFileSystemNode;
    currentPath: string;
    
    constructor() {
        this.root = {
            name: '~',
            type: 'directory',
            children: [],
            path: '/',
        };
        this.currentPath = '/';
    }

    public getNodeByPath(path: string): CustomFileSystemNode | null {
        if (path === '/' || path === '~') return this.root;
        const parts = path.replace(/^~\//, '').split('/').filter(p => p);
        let currentNode: CustomFileSystemNode = path.startsWith('~') ? this.root : this.getNodeByPath(this.currentPath) || this.root;

        for (const part of parts) {
            if (!currentNode.children) return null;
            const nextNode = currentNode.children.find(child => child.name === part);
            if (!nextNode) return null;
            currentNode = nextNode;
        }
        return currentNode;
    }

    public getNodeType(node: CustomFileSystemNode | null): 'file' | 'directory' | 'not found' {
        if (!node) return 'not found';
        return node.type;
    }

    public readFile(path: string): string | null {
        const node = this.getNodeByPath(path);
        if (node && node.type === 'file') {
            return node.content || '';
        }
        return null;
    }

    public listDirectory(path: string): string[] | null {
        const node = this.getNodeByPath(path);
        if (node && node.type === 'directory' && node.children) {
            return node.children.map(child => child.name);
        }
        return null;
    }

    public changeDirectory(path: string): boolean {
        const node = this.getNodeByPath(path);
        if (node && node.type === 'directory') {
            this.currentPath = path;
            return true;
        }
        return false;
    }


}

export const fileSystem = new CustomFileSystem();