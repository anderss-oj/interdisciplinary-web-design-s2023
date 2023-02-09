let thirdNumberList = [] //declaring the array for the 3rd numbers to go into
for (let number = 1; number <= 20 ;number += 3){ //this starts the variable 'number' at 1 and adds 3 to it, until it reaches the value 20.
  thirdNumberList.push(number) //while looping, it will add the value of 'number' to the list 'thirdNumberList'
}
console.log(thirdNumberList);