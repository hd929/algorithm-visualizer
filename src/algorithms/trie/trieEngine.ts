import { AlgorithmStep } from '../../types/algorithm';
import { TrieNode, TrieSnapshot } from '../../types/trie';

export const DEFAULT_TRIE_WORDS = ['cat', 'car', 'cart', 'dog'];
export const DEFAULT_SEARCH_TARGET = 'car';

export function recordTrieSimulation(
  words: string[] = DEFAULT_TRIE_WORDS,
  searchWord: string = DEFAULT_SEARCH_TARGET
): AlgorithmStep<TrieSnapshot>[] {
  const steps: AlgorithmStep<TrieSnapshot>[] = [];

  const rootId = 'root';
  const nodes: Record<string, TrieNode> = {
    [rootId]: {
      id: rootId,
      char: 'ROOT',
      isEndOfWord: false,
      children: {},
      depth: 0,
    },
  };

  const cloneNodes = (): Record<string, TrieNode> => {
    const copy: Record<string, TrieNode> = {};
    for (const [k, v] of Object.entries(nodes)) {
      copy[k] = { ...v, children: { ...v.children } };
    }
    return copy;
  };

  const wordsInserted: string[] = [];

  // Step 0: Init
  steps.push({
    stepIndex: steps.length,
    title: 'Khởi tạo Cây Tiền Tố Trie (Prefix Tree)',
    description: `Khởi tạo nút gốc ROOT rỗng. Chuẩn bị lần lượt chèn ${words.length} từ: [${words.join(', ')}] và sau đó thực hiện tìm kiếm từ "${searchWord}".`,
    detail: `Độ phức tạp chèn và tìm kiếm: O(L) với L là độ dài từ. Không gian tiết kiệm nhờ chia sẻ tiền tố chung.`,
    codeLine: 16,
    actionType: 'INIT',
    variables: { 'Số từ cần chèn': words.length, 'Tìm kiếm': searchWord },
    dataSnapshot: {
      nodes: cloneNodes(),
      rootId,
      activeNodeId: rootId,
      currentWord: '',
      charIndex: -1,
      operation: 'INSERT',
      matchedPrefix: '',
      wordsInserted: [],
      status: 'IDLE',
    },
  });

  // Insert words
  for (const word of words) {
    let currentId = rootId;
    let currentPrefix = '';

    steps.push({
      stepIndex: steps.length,
      title: `Bắt Đầu Chèn Từ Mới: "${word}"`,
      description: `Bắt đầu từ nút gốc ROOT, duyệt từng ký tự của từ "${word}" để đi theo nhánh cây tiền tố.`,
      detail: `Word = "${word}", Chiều dài L = ${word.length}`,
      codeLine: 19,
      actionType: 'TRIE_INSERT',
      variables: { 'Đang chèn': word, 'Vị trí hiện tại': 'ROOT' },
      dataSnapshot: {
        nodes: cloneNodes(),
        rootId,
        activeNodeId: rootId,
        currentWord: word,
        charIndex: 0,
        operation: 'INSERT',
        matchedPrefix: '',
        wordsInserted: [...wordsInserted],
        status: 'TRAVERSING',
      },
    });

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      currentPrefix += char;
      const existingChildId = nodes[currentId].children[char];

      if (existingChildId) {
        // Character already exists, reuse it!
        currentId = existingChildId;
        steps.push({
          stepIndex: steps.length,
          title: `Chia Sẻ Tiền Tố: Ký tự '${char}' đã tồn tại trong nhánh`,
          description: `Ký tự '${char}' đã có sẵn trong cây tiền tố từ các từ trước (tiền tố "${currentPrefix}"). Không cần tạo nút mới, tiếp tục đi xuống nút này!`,
          detail: `Tận dụng nhánh có sẵn: Nút '${char}' (ID: ${currentId}).`,
          codeLine: 24,
          actionType: 'TRIE_TRAVERSE',
          variables: {
            'Ký tự': char,
            'Tiền tố chung': currentPrefix,
            'Nút hiện tại': currentId,
          },
          dataSnapshot: {
            nodes: cloneNodes(),
            rootId,
            activeNodeId: currentId,
            currentWord: word,
            charIndex: i,
            operation: 'INSERT',
            matchedPrefix: currentPrefix,
            wordsInserted: [...wordsInserted],
            status: 'TRAVERSING',
          },
        });
      } else {
        // Create new child node
        const newChildId = `node_${currentPrefix}`;
        nodes[newChildId] = {
          id: newChildId,
          char,
          isEndOfWord: false,
          children: {},
          parentId: currentId,
          depth: i + 1,
        };
        nodes[currentId].children[char] = newChildId;
        currentId = newChildId;

        steps.push({
          stepIndex: steps.length,
          title: `Tạo Nút Mới Cho Ký Tự '${char}'`,
          description: `Chưa có nhánh rẽ cho ký tự '${char}'. Tạo nút con mới '${char}' nối từ nút cha và tiến tới nút này.`,
          detail: `Tạo mới: '${char}' (tiền tố mới "${currentPrefix}").`,
          codeLine: 22,
          actionType: 'INSERT_NODE',
          variables: {
            'Tạo nút mới': `'${char}'`,
            'Tiền tố': currentPrefix,
          },
          dataSnapshot: {
            nodes: cloneNodes(),
            rootId,
            activeNodeId: currentId,
            currentWord: word,
            charIndex: i,
            operation: 'INSERT',
            matchedPrefix: currentPrefix,
            wordsInserted: [...wordsInserted],
            status: 'ADDED_CHAR',
          },
        });
      }
    }

    // Mark end of word
    nodes[currentId].isEndOfWord = true;
    wordsInserted.push(word);

    steps.push({
      stepIndex: steps.length,
      title: `Hoàn Tất Chèn Từ: Đánh Dấu isEndOfWord = true cho "${word}"`,
      description: `Đã duyệt hết các ký tự. Đánh dấu nút kết thúc '${nodes[currentId].char}' của từ "${word}" thành true (màu ngọc lục bảo).`,
      detail: `Đã lưu từ hoàn chỉnh: "${word}".`,
      codeLine: 26,
      actionType: 'FOUND',
      variables: {
        'Từ đã chèn': word,
        'Nút kết thúc': nodes[currentId].char,
        isEndOfWord: true,
      },
      dataSnapshot: {
        nodes: cloneNodes(),
        rootId,
        activeNodeId: currentId,
        currentWord: word,
        charIndex: word.length - 1,
        operation: 'INSERT',
        matchedPrefix: currentPrefix,
        wordsInserted: [...wordsInserted],
        status: 'MARKED_END',
      },
    });
  }

  // Search phase for searchWord
  steps.push({
    stepIndex: steps.length,
    title: `Bắt Đầu Tìm Kiếm Từ: "${searchWord}"`,
    description: `Bắt đầu duyệt từ nút ROOT để tra cứu xem từ "${searchWord}" có tồn tại hoàn chỉnh trong cây Trie hay không.`,
    detail: `Query = "${searchWord}"`,
    codeLine: 30,
    actionType: 'SEARCH_STEP',
    variables: { 'Từ cần tìm': searchWord, 'Nút bắt đầu': 'ROOT' },
    dataSnapshot: {
      nodes: cloneNodes(),
      rootId,
      activeNodeId: rootId,
      currentWord: searchWord,
      charIndex: -1,
      operation: 'SEARCH',
      matchedPrefix: '',
      wordsInserted: [...wordsInserted],
      status: 'TRAVERSING',
    },
  });

  let curSearchId: string | null = rootId;
  let searchPrefix = '';
  let found = true;

  for (let i = 0; i < searchWord.length; i++) {
    const char = searchWord[i];
    searchPrefix += char;
    const nextChildId: string | undefined = nodes[curSearchId!].children[char];

    if (!nextChildId) {
      found = false;
      steps.push({
        stepIndex: steps.length,
        title: `Không Tìm Thấy Ký Tự '${char}' Trong Nhánh Cây!`,
        description: `Tại tiền tố "${searchPrefix.slice(0, -1)}", không có cạnh nhánh nào dẫn đến '${char}'. Kết luận: Từ "${searchWord}" KHÔNG tồn tại trong từ điển!`,
        detail: `Dừng tìm kiếm tại ký tự '${char}' (index ${i}).`,
        codeLine: 34,
        actionType: 'NOT_FOUND',
        variables: {
          'Ký tự thiếu': char,
          'Kết quả': 'NOT_FOUND',
        },
        dataSnapshot: {
          nodes: cloneNodes(),
          rootId,
          activeNodeId: curSearchId!,
          currentWord: searchWord,
          charIndex: i,
          operation: 'SEARCH',
          matchedPrefix: searchPrefix.slice(0, -1),
          wordsInserted: [...wordsInserted],
          status: 'NOT_FOUND',
        },
      });
      break;
    } else {
      curSearchId = nextChildId;
      steps.push({
        stepIndex: steps.length,
        title: `Khớp Ký Tự '${char}' ➔ Đi Tiếp Đến Nút '${nodes[curSearchId].char}'`,
        description: `Tìm thấy nhánh khớp cho '${char}'. Tiền tố khớp hiện tại: "${searchPrefix}".`,
        detail: `Khớp ${i + 1}/${searchWord.length} ký tự.`,
        codeLine: 35,
        actionType: 'TRIE_TRAVERSE',
        variables: {
          'Ký tự khớp': char,
          'Tiền tố khớp': searchPrefix,
        },
        dataSnapshot: {
          nodes: cloneNodes(),
          rootId,
          activeNodeId: curSearchId,
          currentWord: searchWord,
          charIndex: i,
          operation: 'SEARCH',
          matchedPrefix: searchPrefix,
          wordsInserted: [...wordsInserted],
          status: 'TRAVERSING',
        },
      });
    }
  }

  if (found && curSearchId) {
    const isWord = nodes[curSearchId].isEndOfWord;
    steps.push({
      stepIndex: steps.length,
      title: isWord
        ? `🎉 TÌM THẤY TỪ HOÀN CHỈNH: "${searchWord}"!`
        : `Tìm thấy Tiền Tố "${searchWord}", nhưng không phải từ hoàn chỉnh`,
      description: isWord
        ? `Đã đi hết các ký tự và nút cuối '${nodes[curSearchId].char}' có cờ isEndOfWord = true. Từ "${searchWord}" có trong Trie!`
        : `Nút cuối có tồn tại nhưng cờ isEndOfWord = false. Đây chỉ là tiền tố (prefix) chứ không phải từ độc lập.`,
      detail: `isEndOfWord = ${isWord}`,
      codeLine: 37,
      actionType: isWord ? 'FOUND' : 'SEARCH_STEP',
      variables: {
        'Tìm kiếm từ': searchWord,
        'Nút cuối': nodes[curSearchId].char,
        isEndOfWord: isWord,
        'Kết luận': isWord ? 'TỒN TẠI' : 'CHỈ LÀ TIỀN TỐ',
      },
      dataSnapshot: {
        nodes: cloneNodes(),
        rootId,
        activeNodeId: curSearchId,
        currentWord: searchWord,
        charIndex: searchWord.length - 1,
        operation: 'SEARCH',
        matchedPrefix: searchPrefix,
        wordsInserted: [...wordsInserted],
        status: isWord ? 'WORD_FOUND' : 'PREFIX_FOUND',
      },
    });
  }

  // Complete
  steps.push({
    stepIndex: steps.length,
    title: 'Hoàn Tất Mô Phỏng Cấu Trúc Dữ Liệu Trie',
    description: `Cây Trie đã biểu diễn trực quan cấu trúc chia sẻ bộ nhớ tiền tố, tốc độ tìm kiếm O(L) độc lập với số lượng từ N trong từ điển.`,
    detail: `Tổng số từ trong Trie = ${wordsInserted.length}.`,
    codeLine: 40,
    actionType: 'COMPLETE',
    variables: { 'Tổng từ đã lưu': wordsInserted.join(', ') },
    dataSnapshot: {
      nodes: cloneNodes(),
      rootId,
      activeNodeId: rootId,
      currentWord: '',
      charIndex: -1,
      operation: 'DONE',
      matchedPrefix: '',
      wordsInserted: [...wordsInserted],
      status: 'IDLE',
    },
  });

  return steps;
}
