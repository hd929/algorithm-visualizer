export const KNAPSACK_CODE = `// 0/1 Knapsack Dynamic Programming (Quy hoạch động)
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {
    // Khởi tạo bảng dp kích thước (n+1) x (W+1) bằng 0
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    
    // Xây dựng bảng dp[][]
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                // Lựa chọn: Lấy (Take) hoặc Bỏ qua (Skip)
                int take = val[i - 1] + dp[i - 1][w - wt[i - 1]];
                int skip = dp[i - 1][w];
                dp[i][w] = max(take, skip);
            } else {
                // Vật phẩm quá nặng, bắt buộc bỏ qua
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    // Truy vết các vật phẩm tối ưu
    int res = dp[n][W];
    int w = W;
    vector<int> selected;
    for (int i = n; i > 0 && res > 0; i--) {
        if (res != dp[i - 1][w]) {
            selected.push_back(i);
            res -= val[i - 1];
            w -= wt[i - 1];
        }
    }
    return dp[n][W];
}`;

export const KNAPSACK_CODE_LINES = KNAPSACK_CODE.split('\n');
