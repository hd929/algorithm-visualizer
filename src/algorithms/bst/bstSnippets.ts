export const BST_CPP_CODE = `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);

    // Thuộc tính BST: nhỏ hơn sang trái, lớn hơn sang phải
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    return root;
}`;

export const BST_CODE_LINES = BST_CPP_CODE.split('\n');
