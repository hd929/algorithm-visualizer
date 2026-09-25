export const TOPO_SORT_CODE = `// Topological Sort (Thuật toán Kahn - Sắp xếp Tô-pô Đồ Thị Có Hướng DAG)
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<int> topologicalSort(int V, const vector<vector<int>>& adj) {
    vector<int> inDegree(V, 0);
    
    // 1. Tính bán bậc vào (in-degree) cho mọi đỉnh
    for (int u = 0; u < V; u++) {
        for (int v : adj[u]) {
            inDegree[v]++;
        }
    }

    // 2. Đưa các đỉnh có in-degree = 0 vào Hàng đợi Queue
    queue<int> q;
    for (int i = 0; i < V; i++) {
        if (inDegree[i] == 0) q.push(i);
    }

    vector<int> topoOrder;
    
    // 3. Lần lượt lấy đỉnh ra khỏi Queue và gỡ bỏ các cạnh đi ra
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        topoOrder.push_back(u);

        // Giảm bán bậc vào của các đỉnh kề
        for (int v : adj[u]) {
            inDegree[v]--;
            // Nếu đỉnh kề không còn ràng buộc nào (in-degree == 0)
            if (inDegree[v] == 0) {
                q.push(v);
            }
        }
    }

    // Nếu topoOrder.size() < V, đồ thị tồn tại chu trình (Cycle)
    return topoOrder;
}`;

export const TOPO_SORT_CODE_LINES = TOPO_SORT_CODE.split('\n');
