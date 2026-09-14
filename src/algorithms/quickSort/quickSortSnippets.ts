export const QUICK_SORT_CPP_CODE = `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // Chọn phần tử cuối làm Pivot
    int i = low - 1;

    for (int j = low; j < high; j++) {
        // Nếu arr[j] <= pivot: dời i và hoán đổi
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]); // Đặt Pivot vào đúng vị trí
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);

        quickSort(arr, low, pi - 1);  // Đệ quy nửa trái
        quickSort(arr, pi + 1, high); // Đệ quy nửa phải
    }
}`;

export const QUICK_SORT_CODE_LINES = QUICK_SORT_CPP_CODE.split('\n');
