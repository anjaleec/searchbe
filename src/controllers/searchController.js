let fs = require('fs');
let workableData;
var searchTrie = new Trie(); //creation of a global Trie DS

//This function will be used for loading data to the Data Structure/Pre-Computing the Data Structure
module.exports.loadData = async () => {

    //Reading data.csv
    fs.readFile('data.csv', 'utf8', function (err, data) {
        if (err) {
            res.send(err);
        } else {
            //Creating sets of givenname-middlename-surname & inserting to the Trie thus created for search
            workableData = (data.split(',').join(" ").split('\n'));
            for (let i = 1; i < workableData.length; i++) {
                searchTrie.insert(workableData[i])
            }
        }
    });
}

//This function will be used for responding when route specified in routes/searchRoute.js is hit.
module.exports.searchget = async (req, res) => {
    let { searchterm } = req.headers, result;

    if (searchterm.length < 3) { //if search term length < 3, result should show the following message 
        result = "Search Term must be >= 3 characters"
    } else {  //if search term length >= 3, search result should be computed
        result = searchTrie.search(searchterm);
    }
    for (let i = 0; i < 10; i++) {
        console.log("loading data.....", i);
        await this.loadData();
        await sleep(10000);
        console.log("completed loading data.....", i);
        // console.log("loading data.....");
    }
    // const timeoutObj = setTimeout(async () => {
    // }, 1000);
    // clearTimeout(timeoutObj);
    console.log(result);
    res.json({
        result
    });
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

/*This function will be used for creation of a new Trie Node using the Map() JavaScript Object, 
    with parentword as an empty array (for storing more than one parentwords,
    end=false unless it is the last node,
    function parentIs to get the parentword,
    function setParentWord to set the parentword,
    function setEnd to set the "end" attribute,
    function isEnd to get the value of "end" attribute
*/
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

//This function will be used for creation of a new Trie DS, insertion of new nodes into the Trie, searching in the Trie.
function Trie() {

    this.root = new TrieNode();

    //addition of each node---if node is specified, then it will take node as the last parameter, else, it will assume root to be the last parameter
    this.add = function (input, originalWord, node = this.root) {

        if (input.length == 0) {//if input is "", we set the end as true & the parentword as original word -- this helps us in case of search
            node.setParentWord(originalWord);
            node.setEnd();
        } else if (!node.keys.has(input[0])) { //if the Trie doesn't have a node with the incoming letter, a new node is created
            node.keys.set(input[0], new TrieNode());
            this.add(input.substr(1), originalWord, node.keys.get(input[0]));
        } else {//else we simply add it to our existing Trie on the basis of the node
            this.add(input.substr(1), originalWord, node.keys.get(input[0]));
        };
    };

    //insertion of new string---leads to addition of new nodes in recursive manner
    this.insert = function (input) {
        let subStringArray, inputString;

        //finding all sub-strings to create suffix tree
        findSubstringArray(input, (subArray, inputStringCB) => {
            subStringArray = subArray;
            inputString = inputStringCB

        });

        //for all occurences in the sub-string array, the add method is called
        for (let i = 0; i < subStringArray.length; i++) {
            this.add(subStringArray[i], inputString);
        }
    };

    //function for searching the query term
    this.search = function (queryString) {
        //Since queryString will get truncated in each case, assigning it to another variable for later use (in the comparator function)
        let searchTerm = queryString.toLowerCase();
        queryString = queryString.toLowerCase();

        let node = this.root, resultArray = [];

        //while the queryString is not "", we check if the first letter still exists in the Trie node or not
        while (queryString.length > 1) {
            if (!node.keys.has(queryString[0])) {
                return resultArray;//if it does not exist, we return an empty array
            } else {//if it does, we assign it's key to node for finding the parentword below
                node = node.keys.get(queryString[0]);
                queryString = queryString.substr(1);
            };
        };

        //once we reach the end, we push the parentword to the resultArray
        if (node.keys.has(queryString) && node.keys.get(queryString).isEnd()) {
            resultArray.push(...node.keys.get(queryString).parentword);
        }

        //the resultArray is sorted for length comparison & if it starts with the searchTerm, it is then filtered for uniqueness 
        return resultArray.sort(comparator).filter((e, i) => resultArray.indexOf(e) == i);

        //function for length comparison & to check if the entry in the resultArray starts with the searchTerm or not -- accordingly sorts the resultArray
        function comparator(a, b) {
            if ((a.length < b.length) && (a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length < b.length) && (a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm)) || (a.length < b.length) && !(a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm)) || (a.length > b.length) && (a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm)) || (a.length == b.length) && (a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm))) {
                return -1;
            }
            else if ((a.length < b.length) && !(a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length > b.length) && (a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length > b.length) && !(a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length > b.length) && !(a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm)) || (a.length == b.length) && !(a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm))) {
                return 1;
            }
            else if ((a.length == b.length) && (a.toLowerCase().startsWith(searchTerm)) && (b.toLowerCase().startsWith(searchTerm)) || (a.length == b.length) && !(a.toLowerCase().startsWith(searchTerm)) && !(b.toLowerCase().startsWith(searchTerm))) {
                return 0;
            }
            return 0;
        }
    };
}

//This function will be used for finding all the sub-strings of the inputString
function findSubstringArray(inputString, callback) {
    var i, j, result = [];

    for (i = 0; i < inputString.length; i++) {
        for (j = i + 1; j < inputString.length + 1; j++) {
            result.push(inputString.slice(i, j).toLowerCase());
        }
    }
    return callback(result, inputString);
}