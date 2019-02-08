let fs = require('fs');
let workableData;
var searchTrie = new Trie();

module.exports.loadData = () => {
    fs.readFile('data.csv', 'utf8', function (err, data) {
        if (err) {
            res.send(err);
        } else {
            // console.log(typeof(data));
            workableData = (data.split(',').join(" ").split('\n'));
            for (let i = 1; i < workableData.length; i++) {
                searchTrie.insert(workableData[i])
            }
        }
    });
}

module.exports.searchget = (req, res) => {
    // console.log("req.headers is-----", req.headers);
    let { searchterm } = req.headers;
    let result = searchTrie.search(searchterm);

    res.json({
        result
    });
}

function TrieNode() {
    this.keys = new Map();
    this.end = false;
    this.parentword = [];
    this.setParentWord = function (parentword) {
        this.parentword.push(parentword);
    }
    this.parentIs = function () {
        return this.parentword;
    };
    this.setEnd = function () {
        this.end = true;
    };
    this.isEnd = function () {
        return this.end;
    };

};

function Trie() {

    this.root = new TrieNode();

    this.add = function (input, originalWord, node = this.root) {
        if (input.length == 0) {
            node.setParentWord(originalWord);
            node.setEnd();
        } else if (!node.keys.has(input[0])) {
            node.keys.set(input[0], new TrieNode());
            this.add(input.substr(1), originalWord, node.keys.get(input[0]));
        } else {
            this.add(input.substr(1), originalWord, node.keys.get(input[0]));
        };
    };

    this.insert = function (input) {
        let subStringArray, inputString;

        findSubstringArray(input, (subArray, inputStringCB) => {
            subStringArray = subArray;
            inputString = inputStringCB

        });
        for (let i = 0; i < subStringArray.length; i++) {
            this.add(subStringArray[i], inputString);
        }
    };

    this.search = function (queryString) {
        let searchTerm = queryString.toLowerCase();
        queryString = queryString.toLowerCase();

        let node = this.root, resultArray = [];

        while (queryString.length > 1) {
            if (!node.keys.has(queryString[0])) {
                return resultArray;
            } else {
                node = node.keys.get(queryString[0]);
                queryString = queryString.substr(1);
            };
        };


        if (node.keys.has(queryString) && node.keys.get(queryString).isEnd()) {
            resultArray.push(...node.keys.get(queryString).parentword);
        }


        return resultArray.sort(comparator).filter((e, i) => resultArray.indexOf(e) == i);

        function comparator(a, b) {
            if ((a.length < b.length) && (a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length < b.length) && (a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm)) || (a.length < b.length) && !(a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm)) || (a.length > b.length) && (a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm)) || (a.length = b.length) && (a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm))) {
                return -1;
            }
            else if ((a.length < b.length) && !(a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length > b.length) && (a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length > b.length) && !(a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length > b.length) && !(a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm)) || (a.length = b.length) && !(a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm))) {
                return 1;
            }
            else if ((a.length = b.length) && (a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length = b.length) && !(a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm))) {
                return 0;
            }
            return 0;

        }
    };
}

function findSubstringArray(inputString, callback) {
    var i, j, result = [];

    for (i = 0; i < inputString.length; i++) {
        for (j = i + 1; j < inputString.length + 1; j++) {
            result.push(inputString.slice(i, j).toLowerCase());
        }
    }
    return callback(result, inputString);
}