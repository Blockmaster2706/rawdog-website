export class CustomFileSystem {
    constructor() {
        this.root = {
            name: '~',
            type: 'directory',
            children: [],
            path: '/',
        };
        this.currentPath = '/';
    }
    getNodeByPath(path) {
        if (path === '/' || path === '~')
            return this.root;
        const parts = path.replace(/^~\//, '').split('/').filter(p => p);
        let currentNode = path.startsWith('~') ? this.root : this.getNodeByPath(this.currentPath) || this.root;
        for (const part of parts) {
            if (!currentNode.children)
                return null;
            const nextNode = currentNode.children.find(child => child.name === part);
            if (!nextNode)
                return null;
            currentNode = nextNode;
        }
        return currentNode;
    }
    getNodeType(node) {
        if (!node)
            return 'not found';
        return node.type;
    }
    readFile(path) {
        const node = this.getNodeByPath(path);
        if (node && node.type === 'file') {
            return node.content || '';
        }
        return null;
    }
    listDirectory(path) {
        const node = this.getNodeByPath(path);
        if (node && node.type === 'directory' && node.children) {
            return node.children.map(child => child.name);
        }
        return null;
    }
    changeDirectory(path) {
        const node = this.getNodeByPath(path);
        if (node && node.type === 'directory') {
            this.currentPath = path;
            return true;
        }
        return false;
    }
}
export const fileSystem = new CustomFileSystem();
//# sourceMappingURL=types.js.map