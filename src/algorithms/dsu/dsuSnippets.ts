export const DSU_CPP_CODE = `struct DSU {
    vector<int> parent, rank, size;
    
    DSU(int n) {
        parent.resize(n);
        rank.assign(n, 0);
        size.assign(n, 1);
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int u) {
        if (u == parent[u]) return u;
        return parent[u] = find(parent[u]); // Path Compression
    }

    bool unite(int u, int v) {
        int rootU = find(u);
        int rootV = find(v);
        if (rootU == rootV) return false; // Already in same set
        
        if (rank[rootU] < rank[rootV]) swap(rootU, rootV);
        parent[rootV] = rootU; // Union: attach smaller tree
        if (rank[rootU] == rank[rootV]) rank[rootU]++;
        size[rootU] += size[rootV];
        return true;
    }
};`;

export const DSU_CODE_LINES = DSU_CPP_CODE.split('\n');
