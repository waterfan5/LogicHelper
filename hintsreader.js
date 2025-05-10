    //either ([x1,x2...], [y1,y2]))
    //not (x,[y1,y2,y3])
    //equal(x,y)
    //distinct([y1,y2,y3])
    //delta (x,y,diff,catnr)

function replaceStrings(input, sources, destinations) {
    if (sources.length !== destinations.length) {
        throw new Error("Sources and destinations arrays must have the same length.");
    }

    let result = input;
    sources.forEach((source, index) => {
        const destination = destinations[index];
        // Use a global regex to replace all occurrences
        const regex = new RegExp(source, 'g');
        result = result.replace(regex, destination);
    });

    return result;
}

function TestInterpretationString(input, words, numberidx) {
    var fulloutput = "";
    if (input[1] == ")") input = input.slice(2);
    aSources = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eigth", "nineth", "tenth", "an hour"];
    aDests = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "1 hour"];
    input = replaceStrings(input, aSources, aDests);
    var subsentences = splitSubSentences(input.toLowerCase(),words);
    for (let i = 0; i < subsentences.length; i++) {
        var output = TestSubInterpretationString(subsentences[i], words, numberidx);
        if (output != "") {
            fulloutput += output + ";";
        }
    }
    return (fulloutput);
}

function TestSubInterpretationString(input, words, numberidx) {
    var output;
    output = TestPositionString(input, words, numberidx);  //Delta
    if (output != "") return (output);
    output = TestEitherString(input, words, numberidx); //Either
    if (output != "") return (output);
    output = TestNotString(input, words, numberidx); //Not
    if (output != "") return (output);
    output = TestPositiveString(input, words, numberidx); //Equal
    if (output != "") return (output);
    output = TestDistinctString(input, words, numberidx); //Distinct
    return (output);
}

function TestDistinctString(input, words, numberidx) {
    var allwords = findSubstrings(input, words);
    return ("distinct(" + arrayToString(allwords) + ")");
}

function TestPositionString(input, words, numberidx) {
    var response = analyzePositionString(input);
    if (response.found > 0) {
        var leftwords = findSubstrings(input.slice(0, response.found), words);
        var rightwords = findSubstrings(input.slice(response.found), words);
        if (response.amount != "0") {
            sOperator = "=";
        } else {
            sOperator = ">";

        }
        //Swap
        if (response.direction == -1) {
            var temp = leftwords;
            leftwords = rightwords;
            rightwords = temp;
        }
        return ("delta(" + leftwords[0] + "," + rightwords[0] + "," + response.amount.toString() + ","+ sOperator +"," + numberidx + ")");
    }
    else
        return ("");
}


function TestEitherString(input, words, numberidx) {
    var response = input.indexOf(" either ");
    if (response <= 0) {
        response = input.indexOf(", one ");
    }
    if (response > 0) {
        var leftwords = findSubstrings(input.slice(0, response), words);
        var rightwords = findSubstrings(input.slice(response), words);
        return ("either(" + arrayToString(leftwords) + "," + arrayToString(rightwords) + ")");
    }
    else
        return ("");
}

/**
 * Swap the values of two strings.
 * @param {string} str1 - The first string.
 * @param {string} str2 - The second string.
 * @returns {[string, string]} An array with the swapped values.
 */
function swapStrings(str1, str2) {
    return [str2, str1];
}


/**
 * Find substrings from a list that appear in a given string.
 * @param {string} input - The string to search within.
 * @param {string[]} substrings - The list of possible substrings.
 * @returns {string[]} An array of substrings that were found in the input string.
 */
function findSubstrings(input, substrings) {
    // Normalize input to lowercase for case-insensitive matching.
    const lowerInput = input.toLowerCase();

    // Filter the list of substrings to include only those found in the input string.
    return substrings.filter(substring => lowerInput.includes(substring.toLowerCase()));
}

/**
 * Test if any of the specified words are in a string and return the position of the first match.
 * @param {string} input - The string to search within.
 * @param {string[]} words - The list of words to test for.
 * @returns {{word: string, position: number} | null} The matched word and its position, or null if no match is found.
 */
function findWordPosition(input, words) {
    const lowerInput = input.toLowerCase();

    for (const word of words) {
        const position = lowerInput.indexOf(word.toLowerCase());
        if (position !== -1) {
            return position;
        }
    }

    return -1;
}

function findFirstWordPosition(input, words) {
    let firstPosition = -1; // Default position if no word is found

    for (let word of words) {
        let position = input.indexOf(word);
        if (position !== -1 && (firstPosition === -1 || position < firstPosition)) {
            firstPosition = position;
        }
    }

    return firstPosition;
}


function findLastWordPosition(input, words) {
    let lastPosition = -1; // Default position if no word is found

    for (let word of words) {
        let position = input.indexOf(word);
        if (position > lastPosition) {
            lastPosition = position;
        }
    }

    return lastPosition;
}


function TestNotString(input, words, numberidx) {
    var response = analyzeNotString(input);
    if (response != -1) {
        var leftwords = findSubstrings(input.slice(0, response), words);
        var rightwords = findSubstrings(input.slice(response), words);
        return ("not(" + leftwords[0] + "," + arrayToString(rightwords) + ")");
    }
    return ("");
}

function TestPositiveString(input, words, numberidx) {
    var response = analyzePositiveString(input);
    if (response != -1) {
        var leftwords = findSubstrings(input.slice(0, response), words);
        var rightwords = findSubstrings(input.slice(response), words);
        return ("equal(" + leftwords[0] + "," + arrayToString(rightwords) + ")");
    }
    return ("");
}

/**
 * Convert an array of strings to a single string in the format [item1,item2,etc].
 * @param {string[]} array - The array of strings to format.
 * @returns {string} The formatted string.
 */
function arrayToString(array) {
    return `[${array.join(",")}]`;
}

function analyzeNotString(input) {
    const wordsToTest = ["hasn't", "has not", "did not", "didn't", "is not", "isn't", "wasn't", "was not", "is neither"];
    return (findWordPosition(input, wordsToTest));
}

function analyzePositiveString(input) {
    const wordsToTest = [" has ", " did ", " is ", " was ", " owns ", " chose "];
    return (findWordPosition(input, wordsToTest));
}

function analyzePositionString(input) {
    // Normalize input to lowercase for case-insensitive matching.
    const lowerInput = input.toLowerCase();

    // Regular expressions for keywords.

    const forwardRegex = /\b(forward|ahead|higher|more|longer|after|older|later)\b/;
    const backwardRegex = /\b(backward|behind|lower|less|shorter|before|younger|earlier)\b/;
    const numberWordRegex = /\b(one|two|three|four|five|six|seven|eight|nine|ten|[1-9]|[1-9][0-9]|[1-9][0-9][0-9])\b/;
    var positionIndex;

    // Check for forward or ahead after 'position'.
    const forwardMatch = lowerInput.slice(positionIndex).match(forwardRegex);
    const backwardMatch = lowerInput.slice(positionIndex).match(backwardRegex);

    // Determine direction.
    let direction = 0;
    if (forwardMatch) {
        direction = 1;
        positionIndex = forwardMatch.index;
    } else if (backwardMatch) {
        direction = -1;
        positionIndex = backwardMatch.index;
    }

    // Find a number or number word before 'position'.
    const prePositionText = lowerInput.slice(0, positionIndex);
    const numberMatch = prePositionText.match(numberWordRegex);

    // Map number words to numeric values.
    const numberWordMap = {
        one: 1, two: 2, three: 3, four: 4, five: 5,
        six: 6, seven: 7, eight: 8, nine: 9, ten: 10
    };

    let amount = null;
    if (numberMatch) {
        const matchedValue = numberMatch[0];
        amount = isNaN(matchedValue) ? numberWordMap[matchedValue] : parseInt(matchedValue, 10);
    } else {
        amount = 0;
    }

    return { found: positionIndex, direction, amount };
}



function splitSubSentences(input, words) {
    const splits = [", which ", ", who ", ", but"];
    var sentence = input;
    var sentences = [];
    var xloc = 1;
    while (sentence.length > 0) {
        var xloc = findFirstWordPosition(sentence, splits);
        if (xloc > 0) {
            var yloc = sentence.indexOf(",", xloc + 1);
            if (yloc < 0) yloc = input.length;
            var part1 = sentence.slice(0, yloc);
            var zloc = findLastWordPosition(sentence.slice(0, xloc), words);
            if (zloc < 0) zloc = 0;
            part1 = sentence.slice(zloc, yloc);
            sentences.push(part1);
            if (yloc == input.length) { 
                sentences.push(sentence.slice(0, xloc));
                sentence = "";
            }
            else
                sentence = sentence.slice(zloc, xloc) + sentence.slice(yloc + 1);
        } else {
            sentences.push(sentence);
            sentence = "";
        }
    }
    return (sentences);
}