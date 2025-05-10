const EMPTYCHAR = " ";
const POSCHAR = "+";
const NEGCHAR = "-";





function countAssigned(logictable, number_of_cats, number_of_items) {
    var nAssigned = 0;
    for (let catnr1 = 0; catnr1 < number_of_cats; catnr1++) {
        for (let itemnr1 = 0; itemnr1 < number_of_items; itemnr1++) { // Create each item row
            for (let catnr2 = 0; catnr2 < number_of_cats; catnr2++) {
                for (let itemnr2 = 0; itemnr2 < number_of_items; itemnr2++) { // Create each item row
                    if (logictable[catnr1][catnr2][itemnr1][itemnr2] != EMPTYCHAR) { nAssigned += 1;}
                }
            }
        }
    }
    return (nAssigned);
}


function printsmalllogictable(logictable, number_of_cats, number_of_items) {
    var response = "";
    response += "█".repeat((number_of_cats-1) * (number_of_items + 1)+1) + "\n";

    function printsmalllogictablerow(catnr1, maxcat, logictable, number_of_cats, number_of_items) {
        for (let itemnr1 = 0; itemnr1 < number_of_items; itemnr1++) { // Create each item row
            response += "█";
            for (let catnr2 = 1; catnr2 < maxcat; catnr2++) {
                for (let itemnr2 = 0; itemnr2 < number_of_items; itemnr2++) { // Create each item row
                    response += logictable[catnr1][catnr2][itemnr1][itemnr2];
                }
                response += "█";
            }
            response += "\n";
        }
        response += "█".repeat((maxcat-1) * (number_of_items + 1) + 1) + "\n";
    }

    printsmalllogictablerow(0, number_of_cats , logictable, number_of_cats, number_of_items);
    for (let i = number_of_cats - 1; i > 1; i--) {
        printsmalllogictablerow(i, i, logictable, number_of_cats, number_of_items);
    }

    return (response);
}


function printlogictable(logictable, number_of_cats, number_of_items) {
    var response = "";
    response += "█".repeat(number_of_cats * (number_of_items + 1)+1) + "\n";
    for (let catnr1 = 0; catnr1 < number_of_cats; catnr1++) {
        for (let itemnr1 = 0; itemnr1 < number_of_items; itemnr1++) { // Create each item row
            response += "█";
            for (let catnr2 = 0; catnr2 < number_of_cats; catnr2++) {
                for (let itemnr2 = 0; itemnr2 < number_of_items; itemnr2++) { // Create each item row
                    response += logictable[catnr1][catnr2][itemnr1][itemnr2];
                }
                response += "█";
            }
            response += "\n";
        }
        response += "█".repeat(number_of_cats * (number_of_items+1)+1) + "\n";
    }

    return (response);
}




function ProcessInterpretation(txtInterpretation, words, nr_of_cats, nr_of_items, bTrace) {

    if (txtInterpretation.indexOf("undefined") > 0) throw ("Error: The word 'Undefined' was found in the interpretation. This means there is an issue in the interpretation. Please review and adjust the hint or edit the Interpretation.");
    if (txtInterpretation.indexOf("[]") > 0) throw ("Error: An empty set '[]' was found in the interpretation. This means there is an issue in the interpretation. Please review and adjust the hint or edit the Interpretation.");
    var nAssigned;
    var inAttempt = false;
    var logictable = CreateLogicTable(nr_of_cats, nr_of_items);
    var currentLine;
    var fulltrace = "";
    try {
        var interpretationLines = txtInterpretation
            .replace(/\n/g, '')           // Remove all newlines
            .split(';')                   // Split by semicolon
            .map(line => line.trim())     // Trim extra whitespace from each line
            .filter(line => line)         // Remove empty lines (if any)
            .map(line => line.toLowerCase()); // Convert each line to lowercase
        var nMaxAssigned = 0;
        var nInteration = 1;
        while (true) {
            while (true) {
                fulltrace += "Iteration:" + nInteration.toString() + "\n";
                nInteration += 1;
                interpretationLines.map((line, index) => {
                    currentLine = line;
                    console.log(line);
                    fulltrace += line + "\n";
                    if (line.startsWith('equal')) {
                        processEqualLine(line, words, logictable, nr_of_cats, nr_of_items);
                    } else if (line.startsWith('distinct')) {
                        processDistinctLine(line, words, logictable, nr_of_cats, nr_of_items);
                    } else if (line.startsWith('not')) {
                        processNotLine(line, words, logictable, nr_of_cats, nr_of_items);
                    } else if (line.startsWith('either')) {
                        processEitherLine(line, words, logictable, nr_of_cats, nr_of_items);
                    } else if (line.startsWith('delta')) {
                        processDeltaLine(line, words, logictable, nr_of_cats, nr_of_items);
                    }
                });
                nAssigned = countAssigned(logictable, nr_of_cats, nr_of_items);
                console.log("Assigned:" + nAssigned.toString());
                fulltrace += "\nAssigned:" + nAssigned.toString() + "\n";
                if (nAssigned > nMaxAssigned) {
                    nMaxAssigned = nAssigned;
                } else { break; }
            }
            console.log("Applying Logic");
            fulltrace += "\nApplying Logic\n";
            processLogic(logictable, nr_of_cats, nr_of_items);
            nAssigned = countAssigned(logictable, nr_of_cats, nr_of_items);
            if (nAssigned > nMaxAssigned) {
                nMaxAssigned = nAssigned;
            } else { break; }
        }
        return (printsolution(logictable, nr_of_cats, nr_of_items) + printsmalllogictable(logictable, nr_of_cats, nr_of_items) + "\n" + (bTrace ? fulltrace : ""));
    } catch (error) {
        return (error + "\n\n" + printsolution(logictable, nr_of_cats, nr_of_items) + printsmalllogictable(logictable, nr_of_cats, nr_of_items) + "\n" + (bTrace ? fulltrace : ""));
    }

    function processLogic(logictable, nr_of_cats, nr_of_items) {
        for (let cat2 = 1; cat2 < nr_of_cats; cat2++) {
            for (let item1 = 0; item1 < nr_of_items; item1++) {
                for (let item2 = 0; item2 < nr_of_items; item2++) {
                    if (logictable[0][cat2][item1][item2] == EMPTYCHAR) {
                        var newlogictable = structuredClone(logictable);
                        inAttempt = true;
                        try {
                            SetPlus(newlogictable, 0, item1, cat2,item2, nr_of_cats, nr_of_items);
                        } catch (error) {
                            inAttempt = false;
                            // If it cannot be a plus, it has to be a minus
                            SetMinus(logictable, 0, item1, cat2,  item2, nr_of_cats, nr_of_items);
                        } finally {
                            inAttempt = false;
                        }
                    }
                }
            }
        }
    }

    function printsolution(logictable, number_of_cats, number_of_items) {
        var response = "";
        var bComplete = true;
        for (let itemnr1 = 0; itemnr1 < number_of_items; itemnr1++) { // Create each item row
            response += "[" + words[itemnr1];
            for (let catnr2 = 1; catnr2 < number_of_cats; catnr2++) {
                response += ", ";
                bFound = false;
                for (let itemnr2 = 0; itemnr2 < number_of_items; itemnr2++) { // Create each item row
                    if (logictable[0][catnr2][itemnr1][itemnr2] == POSCHAR) {
                        response += words[catnr2 * nr_of_items + itemnr2];
                        bFound = true;
                        break;
                    }
                }
                if (!bFound) {
                    bComplete = false;
                    var newline = "(";
                    for (let itemnr2 = 0; itemnr2 < number_of_items; itemnr2++) { // Create each item row
                        if (logictable[0][catnr2][itemnr1][itemnr2] == EMPTYCHAR) {
                            if (newline.length > 1) { newline += ","; }
                            newline += words[catnr2 * nr_of_items + itemnr2];
                        }
                    }
                    response += newline + ")";
                }
            }
            response += "]\n";
        }
        if (!bComplete) {
            for (let catnr1 = number_of_cats - 1; catnr1 > 1; catnr1--) {
                for (let itemnr1 = 0; itemnr1 < number_of_items; itemnr1++) { // Create each item row
                    response += "[" + words[catnr1 * nr_of_items + itemnr1];
                    for (let catnr2 = 1; catnr2 < catnr1; catnr2++) {
                        response += ", ";
                        bFound = false;
                        for (let itemnr2 = 0; itemnr2 < number_of_items; itemnr2++) { // Create each item row
                            if (logictable[catnr1][catnr2][itemnr1][itemnr2] == POSCHAR) {
                                response += words[catnr2 * nr_of_items + itemnr2];
                                bFound = true;
                                break;
                            }
                        }
                        if (!bFound) {
                            var newline = "(";
                            for (let itemnr2 = 0; itemnr2 < number_of_items; itemnr2++) { // Create each item row
                                if (logictable[catnr1][catnr2][itemnr1][itemnr2] == EMPTYCHAR) {
                                    if (newline.length > 1) { newline += ","; }
                                    newline += words[catnr2 * nr_of_items + itemnr2];
                                }
                            }
                            response += newline + ")";
                        }
                    }
                    response += "]\n";
                }
            }
        }

        return (response);
    }


    // Cat1, Cat2, Item1, Item2
    // . = unassigned
    // + = Positive link
    // - = Negative link
    function CreateLogicTable(number_of_cats, number_of_items) {
        var logictable = [];
        for (let catnr1 = 0; catnr1 < number_of_cats; catnr1++) {
            var catblock = [];
            for (let catnr2 = 0; catnr2 < number_of_cats; catnr2++) {
                var itemrows = [];
                for (let itemnr1 = 0; itemnr1 < number_of_items; itemnr1++) { // Create each item row
                    var itemrow = new Array(number_of_items).fill(EMPTYCHAR);  // With a cell for each column
                    itemrows.push(itemrow); //Add to itemrows
                }
                catblock.push(itemrows);
            }
            logictable.push(catblock);
        }
        return (logictable);
    }

    function processDeltaLine(sentence, words, logictable, nr_of_cats, nr_of_items) {
        // Regex to match delta function parameters
        const regex = /delta\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)/i; // Case-insensitive match
        const match = sentence.match(regex);

        if (match) {
            const firstParam = match[1].trim();                       // First parameter as string
            const secondParam = match[2].trim();                      // Second parameter as string
            const thirdParam = match[3].trim();               // Third parameter as number
            const fourthParam = match[4].trim();                      // Fourth parameter as string
            const fifthParam = match[5].trim();                      // Fourth parameter as string

            const source = words.indexOf(firstParam);
            const target = words.indexOf(secondParam);
            const delta = parseInt(thirdParam);
            const sOperator = fourthParam;
            const offsetcat = parseInt(fifthParam.charAt(fifthParam.length-1))-1;
            return (ProcessDelta(logictable, source, target, delta, sOperator, offsetcat, nr_of_cats, nr_of_items));
        } else {
            throw new Error("Invalid input format");
        }
    }

    function processNotLine(sentence, words, logictable, nr_of_cats, nr_of_items) {
        // Regex to extract parameters inside "not(...)"
        const regex = /not\(([^,]+),\[(.*?)\]\)/i; // Case-insensitive match
        const match = sentence.match(regex);

        if (match) {
            const firstParam = match[1].trim(); // Extract the first parameter
            const secondParam = match[2].split(',').map(item => item.trim()); // Extract second parameter as array

            const source = words.indexOf(firstParam);
            const targets = secondParam.map(item => words.indexOf(item));
            return (ProcessNot(logictable, source, targets, nr_of_cats, nr_of_items));
        } else {
            throw new Error("Invalid input format");
        }
    }

    function processEqualLine(sentence, words, logictable, nr_of_cats, nr_of_items) {
        // Regex to extract parameters inside "equal(...)"
        const regex = /equal\(([^,]+),\[(.*?)\]\)/i; // Case-insensitive match
        const match = sentence.match(regex);

        if (match) {
            const firstParam = match[1].trim(); // Extract the first parameter
            const secondParam = match[2].split(',').map(item => item.trim()); // Extract second parameter as array

            const source = words.indexOf(firstParam);
            const targets = secondParam.map(item => words.indexOf(item));
            return (ProcessEqual(logictable, source, targets, nr_of_cats, nr_of_items))
        } else {
            throw new Error("Invalid input format");
        }
    }

    function processEitherLine(sentence, words, logictable, nr_of_cats, nr_of_items) {
        // Match the content inside the "either()" function
        const regex = /either\(\[(.*?)\],\[(.*?)\]\)/i; // Case-insensitive match
        const match = sentence.match(regex);

        if (match) {
            const firstParam = match[1].split(',').map(item => item.trim());
            const secondParam = match[2].split(',').map(item => item.trim());

            const sources = firstParam.map(item => words.indexOf(item));
            const targets = secondParam.map(item => words.indexOf(item));
            return (ProcessEither(logictable, sources, targets, nr_of_cats, nr_of_items))
        } else {
            throw new Error("Invalid input format");
        }
    }

    function processDistinctLine(sentence, words, logictable, nr_of_cats, nr_of_items) {
        // Match the content inside the "either()" function
        const regex = /distinct\(\[(.*?)\]\)/i; // Case-insensitive match
        const match = sentence.match(regex);

        if (match) {
            const firstParam = match[1]
                .split(',')
                .map(item => item.trim()) // Split by commas and trim whitespace
                .filter(item => item);    // Remove empty elements

            const sources = firstParam.map(item => words.indexOf(item));
            return (ProcessDistinct(logictable, sources, nr_of_cats, nr_of_items))
        } else {
            throw new Error("Invalid input format");
        }
    }

    //Not(single,[targets]), place a - in all associated fields
    //equal(single,[targets]), place a + in all associated fields
    //distinct([targets]), place - in all 2 pairs
    //delta(source, target, delta, column), test options of combinations and place - in those that are not possible
    //either([targets],[targets]), if source or dest are the same category, - others in that category. If different category test options and + if only option possible.

    function generateAllMappings(array1, array2) {
        // Helper function to generate permutations of an array
        function permutations(arr) {
            if (arr.length === 0) return [[]];
            const result = [];
            for (let i = 0; i < arr.length; i++) {
                const rest = arr.slice(0, i).concat(arr.slice(i + 1));
                const restPermutations = permutations(rest);
                restPermutations.forEach(perm => {
                    result.push([arr[i], ...perm]);
                });
            }
            return result;
        }

        // Generate all permutations of array2
        const allPermutations = permutations(array2);

        // Map each permutation to elements of array1
        const mappings = allPermutations.map(perm => {
            return array1.map((item, index) => [item,perm[index]]);
        });

        return mappings;
    }

    function ProcessEither(logictable, sources, targets, nr_of_cats, nr_of_items) {
        ProcessDistinct(logictable, sources, nr_of_cats, nr_of_items);
        ProcessDistinct(logictable, targets, nr_of_cats, nr_of_items);
        const allMappings = generateAllMappings(sources, targets);
        var nValidMapping = 0;
        var validMapping = new Array(allMappings.length).fill(false);
        var bCanMap = [];
        for (let i = 0; i < sources.length; i++) {
            bCanMap.push(new Array(targets.length).fill(false));
        }
        for (let i = 0; i < allMappings.length; i++) {
            var newlogictable = structuredClone(logictable);
            inAttempt = true;
            try {
                for (let j = 0; j < allMappings[i].length; j++) {
                    const mapping = allMappings[i][j];
                    SetPlus(newlogictable, Math.floor(mapping[0] / nr_of_items), mapping[0] % nr_of_items, Math.floor(mapping[1] / nr_of_items), mapping[1] % nr_of_items, nr_of_cats, nr_of_items);
                }
                for (let j = 0; j < allMappings[i].length; j++) {
                    const mapping = allMappings[i][j];
                    bCanMap[sources.indexOf(mapping[0])][targets.indexOf(mapping[1])] = true;
                }
                validMapping[i] = true;
                nValidMapping += 1;
            } catch (error) { } finally { inAttempt = false; }

            
        }
        for (let i = 0; i < sources.length; i++) {
            for (let j = 0; j < targets.length; j++) {
                if (!bCanMap[i][j]) {
                   SetMinus(logictable, Math.floor(sources[i] / nr_of_items), sources[i] % nr_of_items, Math.floor(targets[j] / nr_of_items), targets[j] % nr_of_items, nr_of_cats, nr_of_items);
                }
            }
        }
        if (nValidMapping == 0) { throw ("Invalid logic: no either option for " + currentLine); }
        if (nValidMapping == 1) {
            for (let i = 0; i < validMapping.length; i++) {
                if (validMapping[i]) {
                    for (let j = 0; j < allMappings[i].length; j++) {
                        const mapping = allMappings[i][j];
                        SetPlus(logictable, Math.floor(mapping[0] / nr_of_items), mapping[0] % nr_of_items, Math.floor(mapping[1] / nr_of_items), mapping[1] % nr_of_items, nr_of_cats, nr_of_items);
                    }
                }
            }
        }

        return (logictable);
    }

    function isNumeric(value) {
        return !isNaN(value) && value.trim() !== '';
    }

    function ProcessDelta(logictable, source, target, nDelta, sOperator, nCatNum, nr_of_cats, nr_of_items) {
        catSource = Math.floor(source / nr_of_items);
        itemSource = source % nr_of_items;
        catTarget = Math.floor(target / nr_of_items);
        itemTarget = target % nr_of_items;
        var sourceValid = Array(nr_of_items).fill(false);
        var targetValid = Array(nr_of_items).fill(false);

        for (let numItemTarget = 0; numItemTarget < nr_of_items; numItemTarget++) {
            for (let numItemSource = 0; numItemSource < nr_of_items; numItemSource++) {
                if (numItemTarget != numItemSource) {
                    if ((logictable[catSource][nCatNum][itemSource][numItemSource] != NEGCHAR) &&
                        (logictable[catTarget][nCatNum][itemTarget][numItemTarget] != NEGCHAR)) {
                        var sSource = words[nCatNum * nr_of_items + numItemSource];
                        var sTarget = words[nCatNum * nr_of_items + numItemTarget];
                        var nSourceValue;
                        if (isNumeric(sSource)) { nSourceValue =  parseInt(sSource); } else { nSourceValue = numItemSource;}
                        if (isNumeric(sTarget)) { nTargetValue = parseInt(sTarget); } else { nTargetValue = numItemTarget; }

                        if ((sOperator == "=") || (sOperator == "==")) {
                            if (nSourceValue != (nTargetValue + nDelta)) { continue; }
                        } else if (sOperator == ">") {
                            if (nSourceValue <= (nTargetValue + nDelta)) { continue; }
                        } else if (sOperator == "<") {
                            if (nSourceValue >= (nTargetValue + nDelta)) { continue; }
                        } else if (sOperator == "<=") {
                            if (nSourceValue > (nTargetValue + nDelta)) { continue; }
                        } else if (sOperator == ">=") {
                            if (nSourceValue < (nTargetValue + nDelta)) { continue; }
                        } else if ((sOperator == "!=") || (sOperator == "<>")) {
                            if (nSourceValue == (nTargetValue + nDelta)) { continue; }
                        } else if ((sOperator == "+-") || (sOperator == "-+")) {
                            if ((nSourceValue != (nTargetValue + nDelta)) && (nSourceValue != (nTargetValue - nDelta))) { continue; }
                        }
                        var newlogictable = structuredClone(logictable);
                        inAttempt = true;
                        try {
                            SetPlus(newlogictable, catSource, itemSource, nCatNum, numItemSource, nr_of_cats, nr_of_items);
                            SetPlus(newlogictable, catTarget, itemTarget, nCatNum, numItemTarget, nr_of_cats, nr_of_items);
                            sourceValid[numItemSource] = true;
                            targetValid[numItemTarget] = true;
                        } catch (error) { } finally { inAttempt = false; }


                        //We could actually try it them and see if they don't error out.
                    }
                }
            }
        }
        for (let i = 0; i < nr_of_items; i++) {
            if (!sourceValid[i]) {
                SetMinus(logictable, catSource, itemSource, nCatNum, i, nr_of_cats, nr_of_items);
            }
            if (!targetValid[i]) {
                SetMinus(logictable, catTarget, itemTarget, nCatNum, i, nr_of_cats, nr_of_items);
            }
        }
        return (logictable);
    }

    function ProcessDistinct(logictable, targets, nr_of_cats, nr_of_items) {
        for (let i = 0; i < targets.length; i++) {
            const target1 = targets[i];
            for (let j = 0; j < targets.length; j++) {
                const target2 = targets[j];
                if (i != j) {
                    SetMinus(logictable, Math.floor(target1 / nr_of_items), target1 % nr_of_items, Math.floor(target2 / nr_of_items), target2 % nr_of_items, nr_of_cats, nr_of_items);
                }
            }
        }
        return (logictable);
    }

    function ProcessNot(logictable, source, targets, nr_of_cats, nr_of_items) {
        for (let i = 0; i < targets.length; i++) { 
            const target = targets[i];
            SetMinus(logictable, Math.floor(source / nr_of_items), source % nr_of_items, Math.floor(target / nr_of_items), target % nr_of_items, nr_of_cats, nr_of_items);
        }
        return (logictable);
    }

    function ProcessEqual(logictable, source, targets, nr_of_cats, nr_of_items) {
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            SetPlus(logictable, Math.floor(source / nr_of_items), source % nr_of_items, Math.floor(target / nr_of_items), target % nr_of_items, nr_of_cats, nr_of_items);
        }
        return (logictable);
    }

    //Set Minus
    function SetMinus(logictable, cat1, item1, cat2, item2, nr_of_cats, nr_of_items) {
        if (cat1 == cat2) { return; }
        if (logictable[cat1][cat2][item1][item2] == NEGCHAR) { return; }
        if (!inAttempt) {
            var action = words[cat1 * nr_of_items + item1] + "," + words[cat2 * nr_of_items + item2] + "=" + NEGCHAR;
            fulltrace += action + "\n";
            console.log(action);
        }

        if (logictable[cat1][cat2][item1][item2] == POSCHAR) throw new Error('Invalid logic: plus => minus executing line ' + currentLine + ' for ' + words[cat1 * nr_of_items + item1] + "," + words[cat2 * nr_of_items + item2]);
        logictable[cat1][cat2][item1][item2] = NEGCHAR;
        logictable[cat2][cat1][item2][item1] = NEGCHAR;

        //Test if only 1 minus remains and no plus if so, set plus
        let countplus = 0;
        let countminus = 0;
        countplus = 0;
        countminus = 0;
        for (let i = 0; i < nr_of_items; i++) {
            let x = logictable[cat1][cat2][item1][i];
            if (x == POSCHAR) {
                countplus += 1;
                break;
            }
            if (x == NEGCHAR) {
                countminus += 1;
            }
        }
        if (countminus == nr_of_items) throw new Error('Invalid logic: no room for plus for' + + currentLine);
        if (countplus == 0 && countminus == nr_of_items - 1) {
            for (let i = 0; i < nr_of_items; i++) {
                if (logictable[cat1][cat2][item1][i] == EMPTYCHAR) {
                    SetPlus(logictable, cat1, item1, cat2, i, nr_of_cats, nr_of_items);
                    break;
                }
            }
        }

        //Other way around
        countplus = 0;
        countminus = 0;
        for (let i = 0; i < nr_of_items; i++) {
            let x = logictable[cat1][cat2][i][item2];
            if (x == POSCHAR) {
                countplus += 1;
                break;
            }
            if (x == NEGCHAR) {
                countminus += 1;
            }
        }
        if (countminus == nr_of_items) throw new Error('Invalid logic: no room for plus for ' + currentLine);
        if (countplus == 0 && countminus == nr_of_items - 1) {
            for (let i = 0; i < nr_of_items; i++) {
                if (logictable[cat1][cat2][i][item2] == EMPTYCHAR) {
                    SetPlus(logictable, cat1, i, cat2, item2, nr_of_cats, nr_of_items);
                    break;
                }
            }
        }

        //Transpose minus
        for (let testcat = 0; testcat < nr_of_cats; testcat++) {
            for (let testitem = 0; testitem < nr_of_items; testitem++) {
                if (logictable[cat1][testcat][item1][testitem] == POSCHAR) {  //Find a plus
                    SetMinus(logictable, cat2, item2, testcat, testitem, nr_of_cats, nr_of_items);
                }
                if (logictable[testcat][cat2][testitem][item2] == POSCHAR) {  //Find a plus
                    SetMinus(logictable, cat1, item1,testcat,  testitem, nr_of_cats, nr_of_items);
                }
            }
        }
    }
    //Set Plus
    function SetPlus(logictable, cat1, item1, cat2, item2, nr_of_cats, nr_of_items) {
        if (cat1 == cat2) { return;}
        if (logictable[cat1][cat2][item1][item2] == POSCHAR) { return; }
        if (!inAttempt) {
            var action = words[cat1 * nr_of_items + item1] + "," + words[cat2 * nr_of_items + item2] + "=" + POSCHAR;
            fulltrace += action + "\n";
            console.log(action);
        }
        if (logictable[cat1][cat2][item1][item2] == NEGCHAR) throw new Error('Invalid logic: minus => plus executing ' + currentLine +' for ' + words[cat1 * nr_of_items + item1] + "," + words[cat2 * nr_of_items + item2]);
        logictable[cat1][cat2][item1][item2] = POSCHAR;
        logictable[cat2][cat1][item2][item1] = POSCHAR;

        //Set minusses
        for (let i = 0; i < nr_of_items; i++) {
            if (i != item1) SetMinus(logictable, cat1, i, cat2, item2, nr_of_cats, nr_of_items);
            if (i != item2) SetMinus(logictable, cat1, item1, cat2, i, nr_of_cats, nr_of_items);
        }

        //Transpose Row/column
        for (let testcat = 0; testcat < nr_of_cats; testcat++) {
            for (let testitem = 0; testitem < nr_of_items; testitem++) {
                if (logictable[cat1][testcat][item1][testitem] != EMPTYCHAR) {
                    if (logictable[cat1][testcat][item1][testitem] == POSCHAR) {
                        SetPlus(logictable, cat2, item2, testcat, testitem, nr_of_cats, nr_of_items);
                    }
                    if (logictable[cat1][testcat][item1][testitem] == NEGCHAR) {
                        SetMinus(logictable, cat2, item2, testcat, testitem, nr_of_cats, nr_of_items);
                    }
                }
                if (logictable[testcat][cat2][testitem][item2] != EMPTYCHAR) {
                    if (logictable[testcat][cat2][testitem][item2] == POSCHAR) {
                        SetPlus(logictable, testcat, testitem, cat1, item1, nr_of_cats, nr_of_items);
                    }
                    if (logictable[testcat][cat2][testitem][item2] == NEGCHAR) {
                        SetMinus(logictable, testcat, testitem, cat1, item1, nr_of_cats, nr_of_items);
                    }
                }
            }
        }
    }


}