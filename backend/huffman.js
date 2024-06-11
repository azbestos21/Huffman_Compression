// server/huffman.js
const fs = require('fs');

class Node {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

function buildFrequencyTable(str) {
    const freq = {};
    for (let char of str) {
        if (!freq[char]) freq[char] = 0;
        freq[char]++;
    }
    return freq;
}

function buildHuffmanTree(freq) {
    const nodes = Object.entries(freq).map(([char, freq]) => new Node(char, freq));
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        nodes.push(new Node(null, left.freq + right.freq, left, right));
    }
    return nodes[0];
}

function generateCodes(node, code = '', codes = {}) {
    if (!node) return;
    if (node.char !== null) codes[node.char] = code;
    generateCodes(node.left, code + '0', codes);
    generateCodes(node.right, code + '1', codes);
    return codes;
}

function compress(str, codes) {
    return str.split('').map(char => codes[char]).join('');
}

function huffmanCompress(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const freqTable = buildFrequencyTable(fileContent);
    const huffmanTree = buildHuffmanTree(freqTable);
    const codes = generateCodes(huffmanTree);
    const compressedData = compress(fileContent, codes);
    return { compressedData, codes };
}

module.exports = { huffmanCompress };
