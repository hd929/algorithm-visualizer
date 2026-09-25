export const HEAP_SORT_CODE = `// Heap Sort (Sắp xếp vun đống - Max Heap)
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Vun đống (Heapify) tại nút gốc i cho Heap kích thước n
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;       // Khởi tạo nút lớn nhất là root
    int left = 2 * i + 1;  // Chỉ số con trái
    int right = 2 * i + 2; // Chỉ số con phải

    // So sánh con trái với nút lớn nhất
    if (left < n && arr[left] > arr[largest])
        largest = left;

    // So sánh con phải với nút lớn nhất
    if (right < n && arr[right] > arr[largest])
        largest = right;

    // Nếu nút lớn nhất không phải root ban đầu
    if (largest != i) {
        swap(arr[i], arr[largest]);
        // Đệ quy heapify lại nhánh cây con bị xáo trộn
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();

    // 1. Xây dựng Max-Heap (từ nút nội bộ n/2 - 1 về 0)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // 2. Lần lượt trích xuất cực đại đưa về cuối mảng
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]); // Đưa max (arr[0]) về vị trí đã sắp xếp
        heapify(arr, i, 0);   // Thu hẹp kích thước heap và vun đống lại
    }
}`;

export const HEAP_SORT_CODE_LINES = HEAP_SORT_CODE.split('\n');
