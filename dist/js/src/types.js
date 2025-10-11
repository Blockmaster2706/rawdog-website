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
            return node.children
                .sort((a, b) => {
                if (a.type === b.type)
                    return a.name.localeCompare(b.name);
                return a.type === 'directory' ? -1 : 1;
            })
                .map(child => `${child.type === 'directory' ? '📁' : '📄'} ${child.name}`);
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
    addDirectory(path, name) {
        const parentNode = this.getNodeByPath(path);
        if (parentNode && parentNode.type === 'directory') {
            const newDir = {
                name,
                type: 'directory',
                path: `${parentNode.path}${name}/`,
                children: []
            };
            parentNode.children.push(newDir);
            return true;
        }
        return false;
    }
    addFile(path, name, content) {
        const parentNode = this.getNodeByPath(path);
        if (parentNode && parentNode.type === 'directory') {
            const newFile = {
                name,
                type: 'file',
                content,
                path: `${parentNode.path}${name}`
            };
            parentNode.children.push(newFile);
            return true;
        }
        return false;
    }
}
export const fileSystem = new CustomFileSystem();
//# sourceMappingURL=types.js.map