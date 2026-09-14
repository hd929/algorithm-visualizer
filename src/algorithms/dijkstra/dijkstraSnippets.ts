export const DIJKSTRA_CPP_CODE = `void dijkstra(int startNode, int n, const vector<vector<pair<int, int>>>& adj) {
    vector<int> dist(n, INF);
    // Min-heap priority queue: stores {distance, node}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;

    dist[startNode] = 0;
    pq.push({0, startNode});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop(); // Extract min distance node

        if (d > dist[u]) continue; // Skip outdated distance

        for (auto& [v, weight] : adj[u]) {
            // Relaxation: check if path through u is shorter
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`;

export const DIJKSTRA_CODE_LINES = DIJKSTRA_CPP_CODE.split('\n');
