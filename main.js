function createValue(label) {
  console.log("create: ", label);
  return label;
}

function combine(first, second) {
  console.log("combine: ", first, second);
}

combine(createValue("A"), createValue("B"));
