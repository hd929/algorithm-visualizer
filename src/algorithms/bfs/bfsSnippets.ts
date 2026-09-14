export const BFS_CPP_CODE = `void bfs(int startNode, int n, const vector<vector<int>>& adj) {
    vector<bool> visited(n, false);
    queue<int> q; // Hàng đợi FIFO

    visited[startNode] = true;
    q.push(startNode);

    while (!q.empty()) {
        int u = q.front();
        q.pop(); // Lấy đỉnh đầu hàng đợi

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v); // Đưa đỉnh lân cận vào hàng đợi
            }
        }
    }
}`;

export const BFS_CODE_LINES = BFS_CPP_CODE.split('\n');
