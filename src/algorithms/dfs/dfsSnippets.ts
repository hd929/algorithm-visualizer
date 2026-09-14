export const DFS_CPP_CODE = `void dfs(int u, const vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true; // Đánh dấu đỉnh u đã thăm

    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited); // Đệ quy khám phá sâu vào nhánh v
        }
    }
    // Hoàn tất nhánh u -> Quay lui (Backtrack)
}`;

export const DFS_CODE_LINES = DFS_CPP_CODE.split('\n');
