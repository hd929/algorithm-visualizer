export const BS_CPP_CODE = `int binarySearch(const vector<int>& arr, int target) {
    int low = 0;
    int high = (int)arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid; // Found target!
        }
        else if (arr[mid] < target) {
            // Target is in right half -> eliminate [low..mid]
            low = mid + 1;
        }
        else {
            // Target is in left half -> eliminate [mid..high]
            high = mid - 1;
        }
    }
    return -1; // Target not found
}`;

export const BS_CODE_LINES = BS_CPP_CODE.split('\n');
