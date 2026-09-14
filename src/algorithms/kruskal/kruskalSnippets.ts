export const KRUSKAL_CPP_CODE = `struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

int kruskalMST(int n, vector<Edge>& edges) {
    // 1. Sort edges by weight
    sort(edges.begin(), edges.end());

    DSU dsu(n);
    int mstWeight = 0;
    int edgesCount = 0;

    for (const auto& edge : edges) {
        // 2. Check if u and v are in different sets
        if (dsu.unite(edge.u, edge.v)) {
            mstWeight += edge.weight; // Accept edge
            edgesCount++;
            if (edgesCount == n - 1) break; // MST completed!
        }
        // Else: same set -> reject to prevent cycle
    }
    return mstWeight;
}`;

export const KRUSKAL_CODE_LINES = KRUSKAL_CPP_CODE.split('\n');
