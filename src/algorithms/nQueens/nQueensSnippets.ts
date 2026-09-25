export const N_QUEENS_CODE = `// N-Queens Problem (Bài toán N Quân Hậu - Quay lui Backtracking)
#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

bool isSafe(const vector<int>& board, int row, int col) {
    // Kiểm tra xung đột với tất cả quân hậu đã đặt ở các hàng trước
    for (int prevRow = 0; prevRow < row; prevRow++) {
        int prevCol = board[prevRow];
        // 1. Trùng cột
        if (prevCol == col) return false;
        // 2. Trùng đường chéo chính hoặc chéo phụ
        if (abs(prevRow - row) == abs(prevCol - col)) return false;
    }
    return true; // Vị trí an toàn
}

void solveNQueens(vector<int>& board, int row, int n, int& solutions) {
    // Nếu đã đặt thành công n quân hậu vào n hàng
    if (row == n) {
        solutions++;
        return;
    }

    // Thử đặt quân hậu vào từng cột của hàng hiện tại
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col; // Đặt quân hậu tại (row, col)
            solveNQueens(board, row + 1, n, solutions); // Đệ quy hàng tiếp theo
            board[row] = -1;  // Quay lui (Backtrack): gỡ quân hậu
        }
    }
}

int main() {
    int n = 4, solutions = 0;
    vector<int> board(n, -1);
    solveNQueens(board, 0, n, solutions);
    cout << "Tong so nghiem: " << solutions << endl;
    return 0;
}`;

export const N_QUEENS_CODE_LINES = N_QUEENS_CODE.split('\n');
