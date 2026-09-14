export const MERGE_SORT_CPP_CODE = `void merge(vector<int>& arr, int l, int mid, int r) {
    vector<int> temp(r - l + 1);
    int i = l, j = mid + 1, k = 0;

    // So sánh và đổ phần tử nhỏ hơn vào mảng đệm temp
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= r) temp[k++] = arr[j++];

    // Sao chép ngược lại vào mảng gốc arr
    for (int p = 0; p < k; p++) arr[l + p] = temp[p];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int mid = l + (r - l) / 2;
        mergeSort(arr, l, mid);     // Chia nửa trái
        mergeSort(arr, mid + 1, r); // Chia nửa phải
        merge(arr, l, mid, r);      // Trộn 2 nửa đã sắp xếp
    }
}`;

export const MERGE_SORT_CODE_LINES = MERGE_SORT_CPP_CODE.split('\n');
