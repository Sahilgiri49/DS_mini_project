export interface AlgorithmMeta {
  id: string;
  name: string;
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
  pythonSnippet: string;
  sirExplanation: {
    coreConcept: string;
    loopInvariant: string;
    vivaQuestions: { question: string; answer: string }[];
  };
}

export const COMPLETE_PYTHON_FILE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr


def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr


def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr


def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]

        merge_sort(left_half)
        merge_sort(right_half)

        i = 0
        j = 0
        k = 0

        while i < len(left_half) and j < len(right_half):
            if left_half[i] <= right_half[j]:
                arr[k] = left_half[i]
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1

        while i < len(left_half):
            arr[k] = left_half[i]
            i += 1
            k += 1

        while j < len(right_half):
            arr[k] = right_half[j]
            j += 1
            k += 1

    return arr


def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1

    if low < high:
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        pi = i + 1

        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

    return arr


if __name__ == "__main__":
    sample_data = [64, 34, 25, 12, 22, 11, 90]
    print("Original:", sample_data)
    print("Bubble Sort:", bubble_sort(sample_data.copy()))
    print("Selection Sort:", selection_sort(sample_data.copy()))
    print("Insertion Sort:", insertion_sort(sample_data.copy()))
    print("Merge Sort:", merge_sort(sample_data.copy()))
    print("Quick Sort:", quick_sort(sample_data.copy()))
`;

export const ALGORITHMS: Record<string, AlgorithmMeta> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    timeBest: 'O(n)',
    timeAvg: 'O(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    pythonSnippet: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    sirExplanation: {
      coreConcept: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest element bubbles up to its correct position at the end of each pass.',
      loopInvariant: 'At the end of iteration i, the last i elements of the array are in their sorted and final positions.',
      vivaQuestions: [
        {
          question: 'What is the purpose of the swapped flag?',
          answer: 'It optimizes best-case time complexity to O(n). If no elements were swapped in a pass, the array is already sorted and we can terminate early.'
        },
        {
          question: 'Is Bubble Sort stable? Why?',
          answer: 'Yes, it is stable because equal elements are never swapped (strict inequality arr[j] > arr[j+1] is used).'
        },
        {
          question: 'What is the worst-case scenario for Bubble Sort?',
          answer: 'When the array is reverse sorted. It requires n*(n-1)/2 comparisons and the maximum number of swaps.'
        }
      ]
    }
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    timeBest: 'O(n²)',
    timeAvg: 'O(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    pythonSnippet: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    sirExplanation: {
      coreConcept: 'Divides the list into a sorted sublist at the front and an unsorted sublist. Finds the minimum element from the unsorted sublist and swaps it with the first unsorted element.',
      loopInvariant: 'Subarray arr[0...i-1] consists of the i smallest elements in fully sorted order.',
      vivaQuestions: [
        {
          question: 'Why is Selection Sort preferable when memory write operations are costly?',
          answer: 'Selection Sort performs at most O(n) swaps (at most one per outer loop pass), which is the minimum number of writes compared to other comparison sorts.'
        },
        {
          question: 'Why is standard Selection Sort not stable?',
          answer: 'Long-distance swaps can move an element past an identical element (e.g. in [5, 5*, 2], the first 5 swaps with 2, placing it after 5*).'
        },
        {
          question: 'Can Selection Sort achieve O(n) in best case?',
          answer: 'No, standard Selection Sort always scans the remaining unsorted subarray to find the minimum, making comparisons O(n²) in all cases.'
        }
      ]
    }
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    timeBest: 'O(n)',
    timeAvg: 'O(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    pythonSnippet: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    sirExplanation: {
      coreConcept: 'Builds the final sorted array one item at a time. Takes the next element (key) and shifts larger elements one position to the right to insert key into its correct position.',
      loopInvariant: 'Subarray arr[0...i-1] consists of the original elements from arr[0...i-1] but in sorted order.',
      vivaQuestions: [
        {
          question: 'Why is Insertion Sort ideal for small datasets or nearly sorted arrays?',
          answer: 'When the array is already sorted, the inner while-loop condition immediately fails, running in O(n) time with O(1) space and minimal overhead.'
        },
        {
          question: 'Is Insertion Sort an online algorithm?',
          answer: 'Yes, it can sort a list as it receives it element-by-element without needing the entire dataset upfront.'
        },
        {
          question: 'How many shifts occur in the worst case?',
          answer: 'In reverse sorted order, it performs n*(n-1)/2 comparisons and shifts.'
        }
      ]
    }
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    timeBest: 'O(n log n)',
    timeAvg: 'O(n log n)',
    timeWorst: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
    pythonSnippet: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]

        merge_sort(left_half)
        merge_sort(right_half)

        i = 0
        j = 0
        k = 0

        while i < len(left_half) and j < len(right_half):
            if left_half[i] <= right_half[j]:
                arr[k] = left_half[i]
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1

        while i < len(left_half):
            arr[k] = left_half[i]
            i += 1
            k += 1

        while j < len(right_half):
            arr[k] = right_half[j]
            j += 1
            k += 1

    return arr`,
    sirExplanation: {
      coreConcept: 'A Divide and Conquer algorithm. Recursively splits the array into two halves until single-element subarrays are reached, then merges the sorted halves into a single sorted array.',
      loopInvariant: 'During merging, arr[0...k-1] contains the smallest k elements from left_half and right_half combined in sorted order.',
      vivaQuestions: [
        {
          question: 'Why does Merge Sort guarantee O(n log n) even in the worst case?',
          answer: 'The recursion tree has a depth of log2(n) levels, and at each level merging all elements takes linear O(n) work. Therefore, total time is always n * log2(n).'
        },
        {
          question: 'Why is standard Merge Sort not in-place?',
          answer: 'Merging requires temporary auxiliary storage of size O(n) to hold the split subarrays while comparing and writing back to the original array.'
        },
        {
          question: 'Why is Merge Sort preferred for sorting Linked Lists?',
          answer: 'Linked list nodes can be merged with O(1) auxiliary space simply by rearranging pointers, making space complexity O(1) auxiliary.'
        }
      ]
    }
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    timeBest: 'O(n log n)',
    timeAvg: 'O(n log n)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
    pythonSnippet: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1

    if low < high:
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        pi = i + 1

        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

    return arr`,
    sirExplanation: {
      coreConcept: 'Selects a pivot element and partitions the array such that elements smaller than the pivot go to the left and larger elements go to the right, then recursively sorts the partitions.',
      loopInvariant: 'During Lomuto partition, all elements from low to i are <= pivot, and elements from i+1 to j-1 are > pivot.',
      vivaQuestions: [
        {
          question: 'What causes Quick Sort to degrade to O(n²)?',
          answer: 'When the partition is extremely unbalanced (e.g. choosing the last element as pivot on an already sorted array), yielding recursion depth n instead of log n.'
        },
        {
          question: 'Why is Quick Sort often faster in practice than Merge Sort?',
          answer: 'It has great cache locality, operates in-place without copying arrays to auxiliary memory, and has very small constant factors.'
        },
        {
          question: 'How can worst-case O(n²) be avoided in practice?',
          answer: 'By using randomized pivot selection or the median-of-three technique.'
        }
      ]
    }
  }
};
