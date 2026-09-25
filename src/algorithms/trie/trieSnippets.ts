export const TRIE_CODE = `// Trie (Cây Tiền Tố - Prefix Tree)
#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEndOfWord;
    TrieNode() : isEndOfWord(false) {}
};

class Trie {
private:
    TrieNode* root;

public:
    Trie() { root = new TrieNode(); }

    // 1. Chèn một từ mới vào cây Trie
    void insert(const string& word) {
        TrieNode* current = root;
        for (char c : word) {
            // Nếu nhánh ký tự c chưa tồn tại, tạo nút con mới
            if (current->children.find(c) == current->children.end()) {
                current->children[c] = new TrieNode();
            }
            current = current->children[c]; // Đi xuống nút con
        }
        current->isEndOfWord = true; // Đánh dấu hoàn thành từ
    }

    // 2. Tìm kiếm chính xác một từ trong Trie
    bool search(const string& word) {
        TrieNode* current = root;
        for (char c : word) {
            if (current->children.find(c) == current->children.end())
                return false; // Không tồn tại ký tự tiếp theo
            current = current->children[c];
        }
        return current != nullptr && current->isEndOfWord;
    }
};`;

export const TRIE_CODE_LINES = TRIE_CODE.split('\n');
