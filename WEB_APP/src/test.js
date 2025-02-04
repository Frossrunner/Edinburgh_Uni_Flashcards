const insert = (list, element, index) => {
    // Create a copy of the list
    const newList = [...list];

    // If index is out of range (greater than length), append to end
    if (index >= newList.length) {
        newList.push(element);
    }
    // If index is negative or within range, use splice
    else {
        // Handle negative indices by setting to 0
        const insertIndex = Math.max(0, index);
        newList.splice(insertIndex, 0, element);
    }

    return newList;
};

let list_ = [1,2,3,4,5];
console.log(list_);
let newList = insert(list_, 7, 1);
console.log(newList);