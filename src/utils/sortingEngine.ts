export interface SortStep {
  array: number[];
  type: 'initial' | 'compare' | 'swap' | 'overwrite' | 'mark-sorted' | 'pivot' | 'subsegment' | 'complete';
  indices: number[];
  sortedIndices: number[];
  activePointers: Record<string, number>;
  description: string;
  pythonLineNumber: number;
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
}

export function generateSortSteps(algorithmId: string, initialArr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArr];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedSet = new Set<number>();

  // Initial step
  steps.push({
    array: [...arr],
    type: 'initial',
    indices: [],
    sortedIndices: [],
    activePointers: {},
    description: `Initialized array with ${arr.length} elements.`,
    pythonLineNumber: 1,
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
  });

  if (arr.length <= 1) {
    if (arr.length === 1) sortedSet.add(0);
    steps.push({
      array: [...arr],
      type: 'complete',
      indices: [],
      sortedIndices: Array.from(sortedSet),
      activePointers: {},
      description: 'Array is sorted!',
      pythonLineNumber: 1,
      comparisons: 0,
      swaps: 0,
      arrayAccesses: 0,
    });
    return steps;
  }

  switch (algorithmId) {
    case 'bubble': {
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          accesses += 2;
          steps.push({
            array: [...arr],
            type: 'compare',
            indices: [j, j + 1],
            sortedIndices: Array.from(sortedSet),
            activePointers: { i, j },
            description: `Comparing elements arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
            pythonLineNumber: 6,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });

          if (arr[j] > arr[j + 1]) {
            swaps++;
            accesses += 4;
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            swapped = true;

            steps.push({
              array: [...arr],
              type: 'swap',
              indices: [j, j + 1],
              sortedIndices: Array.from(sortedSet),
              activePointers: { i, j },
              description: `Swapped arr[${j}] and arr[${j + 1}] because ${arr[j + 1]} > ${arr[j]}`,
              pythonLineNumber: 7,
              comparisons,
              swaps,
              arrayAccesses: accesses,
            });
          }
        }
        sortedSet.add(n - i - 1);
        steps.push({
          array: [...arr],
          type: 'mark-sorted',
          indices: [n - i - 1],
          sortedIndices: Array.from(sortedSet),
          activePointers: { i },
          description: `Element at index ${n - i - 1} (${arr[n - i - 1]}) is now in sorted position.`,
          pythonLineNumber: 4,
          comparisons,
          swaps,
          arrayAccesses: accesses,
        });

        if (!swapped) {
          for (let k = 0; k < n; k++) sortedSet.add(k);
          steps.push({
            array: [...arr],
            type: 'complete',
            indices: [],
            sortedIndices: Array.from(sortedSet),
            activePointers: {},
            description: `Early termination: No swaps occurred in pass ${i + 1}. Array is fully sorted!`,
            pythonLineNumber: 10,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });
          break;
        }
      }
      break;
    }

    case 'selection': {
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        steps.push({
          array: [...arr],
          type: 'subsegment',
          indices: [i],
          sortedIndices: Array.from(sortedSet),
          activePointers: { i, min: minIdx },
          description: `Starting pass ${i + 1}. Current minimum assumed at index ${minIdx} (${arr[minIdx]}).`,
          pythonLineNumber: 4,
          comparisons,
          swaps,
          arrayAccesses: accesses,
        });

        for (let j = i + 1; j < n; j++) {
          comparisons++;
          accesses += 2;
          steps.push({
            array: [...arr],
            type: 'compare',
            indices: [j, minIdx],
            sortedIndices: Array.from(sortedSet),
            activePointers: { i, j, min: minIdx },
            description: `Comparing candidate arr[${j}] (${arr[j]}) with current min arr[${minIdx}] (${arr[minIdx]})`,
            pythonLineNumber: 6,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });

          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            steps.push({
              array: [...arr],
              type: 'pivot',
              indices: [minIdx],
              sortedIndices: Array.from(sortedSet),
              activePointers: { i, j, min: minIdx },
              description: `Found new minimum value (${arr[minIdx]}) at index ${minIdx}.`,
              pythonLineNumber: 7,
              comparisons,
              swaps,
              arrayAccesses: accesses,
            });
          }
        }

        if (minIdx !== i) {
          swaps++;
          accesses += 4;
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;

          steps.push({
            array: [...arr],
            type: 'swap',
            indices: [i, minIdx],
            sortedIndices: Array.from(sortedSet),
            activePointers: { i, min: minIdx },
            description: `Swapped minimum element (${arr[i]}) into sorted position at index ${i}.`,
            pythonLineNumber: 8,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });
        }

        sortedSet.add(i);
        steps.push({
          array: [...arr],
          type: 'mark-sorted',
          indices: [i],
          sortedIndices: Array.from(sortedSet),
          activePointers: { i },
          description: `Index ${i} (${arr[i]}) placed into sorted prefix.`,
          pythonLineNumber: 3,
          comparisons,
          swaps,
          arrayAccesses: accesses,
        });
      }
      break;
    }

    case 'insertion': {
      sortedSet.add(0);
      for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        accesses++;
        let j = i - 1;

        steps.push({
          array: [...arr],
          type: 'pivot',
          indices: [i],
          sortedIndices: Array.from(sortedSet),
          activePointers: { i, keyIndex: i },
          description: `Selected key element ${key} at index ${i} to insert into sorted prefix.`,
          pythonLineNumber: 3,
          comparisons,
          swaps,
          arrayAccesses: accesses,
        });

        while (j >= 0) {
          comparisons++;
          accesses++;
          steps.push({
            array: [...arr],
            type: 'compare',
            indices: [j, j + 1],
            sortedIndices: Array.from(sortedSet),
            activePointers: { i, j },
            description: `Comparing arr[${j}] (${arr[j]}) with key (${key})`,
            pythonLineNumber: 5,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });

          if (arr[j] > key) {
            swaps++;
            accesses += 2;
            arr[j + 1] = arr[j];
            steps.push({
              array: [...arr],
              type: 'overwrite',
              indices: [j + 1],
              sortedIndices: Array.from(sortedSet),
              activePointers: { i, j },
              description: `Shifted arr[${j}] (${arr[j]}) one position right to index ${j + 1}`,
              pythonLineNumber: 6,
              comparisons,
              swaps,
              arrayAccesses: accesses,
            });
            j--;
          } else {
            break;
          }
        }

        accesses++;
        arr[j + 1] = key;
        for (let k = 0; k <= i; k++) sortedSet.add(k);

        steps.push({
          array: [...arr],
          type: 'mark-sorted',
          indices: [j + 1],
          sortedIndices: Array.from(sortedSet),
          activePointers: { i, insertedAt: j + 1 },
          description: `Inserted key (${key}) at position ${j + 1}. Prefix up to ${i} is now sorted.`,
          pythonLineNumber: 8,
          comparisons,
          swaps,
          arrayAccesses: accesses,
        });
      }
      break;
    }

    case 'merge': {
      // In-place recording of iterative/recursive merge sort
      const mergeHelper = (start: number, end: number) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);

        steps.push({
          array: [...arr],
          type: 'subsegment',
          indices: [start, end],
          sortedIndices: Array.from(sortedSet),
          activePointers: { start, mid, end },
          description: `Dividing range [${start}...${end}] at midpoint index ${mid}`,
          pythonLineNumber: 3,
          comparisons,
          swaps,
          arrayAccesses: accesses,
        });

        mergeHelper(start, mid);
        mergeHelper(mid + 1, end);

        // Merge operation
        const leftArr = arr.slice(start, mid + 1);
        const rightArr = arr.slice(mid + 1, end + 1);
        accesses += leftArr.length + rightArr.length;

        let p1 = 0;
        let p2 = 0;
        let k = start;

        steps.push({
          array: [...arr],
          type: 'subsegment',
          indices: [start, end],
          sortedIndices: Array.from(sortedSet),
          activePointers: { start, mid, end, k },
          description: `Merging sorted sub-arrays [${start}...${mid}] and [${mid + 1}...${end}]`,
          pythonLineNumber: 15,
          comparisons,
          swaps,
          arrayAccesses: accesses,
        });

        while (p1 < leftArr.length && p2 < rightArr.length) {
          comparisons++;
          accesses += 2;
          steps.push({
            array: [...arr],
            type: 'compare',
            indices: [start + p1, mid + 1 + p2],
            sortedIndices: Array.from(sortedSet),
            activePointers: { left: start + p1, right: mid + 1 + p2, target: k },
            description: `Comparing left element (${leftArr[p1]}) and right element (${rightArr[p2]})`,
            pythonLineNumber: 16,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });

          if (leftArr[p1] <= rightArr[p2]) {
            arr[k] = leftArr[p1];
            p1++;
          } else {
            arr[k] = rightArr[p2];
            p2++;
          }
          swaps++;
          accesses++;

          steps.push({
            array: [...arr],
            type: 'overwrite',
            indices: [k],
            sortedIndices: Array.from(sortedSet),
            activePointers: { k },
            description: `Writing value ${arr[k]} into merged array at index ${k}`,
            pythonLineNumber: 17,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });
          k++;
        }

        while (p1 < leftArr.length) {
          arr[k] = leftArr[p1];
          p1++;
          swaps++;
          accesses++;
          steps.push({
            array: [...arr],
            type: 'overwrite',
            indices: [k],
            sortedIndices: Array.from(sortedSet),
            activePointers: { k },
            description: `Flushing remaining left element (${arr[k]}) to index ${k}`,
            pythonLineNumber: 25,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });
          k++;
        }

        while (p2 < rightArr.length) {
          arr[k] = rightArr[p2];
          p2++;
          swaps++;
          accesses++;
          steps.push({
            array: [...arr],
            type: 'overwrite',
            indices: [k],
            sortedIndices: Array.from(sortedSet),
            activePointers: { k },
            description: `Flushing remaining right element (${arr[k]}) to index ${k}`,
            pythonLineNumber: 30,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });
          k++;
        }

        if (start === 0 && end === arr.length - 1) {
          for (let idx = 0; idx < arr.length; idx++) sortedSet.add(idx);
        }
      };

      mergeHelper(0, arr.length - 1);
      break;
    }

    case 'quick': {
      const quickSortHelper = (low: number, high: number) => {
        if (low < high) {
          const pivotVal = arr[high];
          accesses++;
          let i = low - 1;

          steps.push({
            array: [...arr],
            type: 'pivot',
            indices: [high],
            sortedIndices: Array.from(sortedSet),
            activePointers: { low, high, pivot: high },
            description: `Selected pivot arr[${high}] (${pivotVal}) for range [${low}...${high}]`,
            pythonLineNumber: 6,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });

          for (let j = low; j < high; j++) {
            comparisons++;
            accesses += 2;
            steps.push({
              array: [...arr],
              type: 'compare',
              indices: [j, high],
              sortedIndices: Array.from(sortedSet),
              activePointers: { i, j, pivot: high },
              description: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivotVal})`,
              pythonLineNumber: 9,
              comparisons,
              swaps,
              arrayAccesses: accesses,
            });

            if (arr[j] <= pivotVal) {
              i++;
              swaps++;
              accesses += 4;
              const temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;

              steps.push({
                array: [...arr],
                type: 'swap',
                indices: [i, j],
                sortedIndices: Array.from(sortedSet),
                activePointers: { i, j, pivot: high },
                description: `Swapped arr[${i}] and arr[${j}] to place smaller element on left`,
                pythonLineNumber: 11,
                comparisons,
                swaps,
                arrayAccesses: accesses,
              });
            }
          }

          swaps++;
          accesses += 4;
          const temp = arr[i + 1];
          arr[i + 1] = arr[high];
          arr[high] = temp;
          const pi = i + 1;

          sortedSet.add(pi);
          steps.push({
            array: [...arr],
            type: 'mark-sorted',
            indices: [pi],
            sortedIndices: Array.from(sortedSet),
            activePointers: { pivotFinal: pi },
            description: `Pivot (${arr[pi]}) is in its final sorted position at index ${pi}.`,
            pythonLineNumber: 13,
            comparisons,
            swaps,
            arrayAccesses: accesses,
          });

          quickSortHelper(low, pi - 1);
          quickSortHelper(pi + 1, high);
        } else if (low === high) {
          sortedSet.add(low);
        }
      };

      quickSortHelper(0, arr.length - 1);
      break;
    }
  }

  // Final sorted sweep
  for (let i = 0; i < arr.length; i++) sortedSet.add(i);
  steps.push({
    array: [...arr],
    type: 'complete',
    indices: [],
    sortedIndices: Array.from(sortedSet),
    activePointers: {},
    description: `Sorting complete! Total comparisons: ${comparisons}, swaps/writes: ${swaps}.`,
    pythonLineNumber: 1,
    comparisons,
    swaps,
    arrayAccesses: accesses,
  });

  return steps;
}
