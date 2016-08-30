window.popJSON = {
  // I never create anonymous functions without names
  // so I can find them in stack trace :)
  stringify: function stringify(obj) {
    var currentType = typeof (obj);
    if (currentType != "object" || obj === null) { // It's easier to coherce here
      // simple data type (primitave value)
      if (currentType == "string") obj = '"' + obj.replace(/"/g,'\\\"') + '"';
      return String(obj); // cast, the object to a string
    } else {
      // recurse array or object
      var node, value;
      var json = [];
      // So constructor is not a constructor its just the
      // reverse linkiage if you will on proto chain, we cannot
      // use __proto__ thanks to MS :)
      var arr = (obj && obj.constructor === Array);

      for (node in obj) {
        // time to pop each value out of the object
        value = obj[node];
        currentType = typeof(value);
        if (obj.hasOwnProperty(node)) {
          if (currentType == "string") {
            value = '"' + value.replace(/"/g,'\\\"') + '"';
          } else if (currentType == "object" && value !== null){
            // down the rabbit hole we go, recurse the nodes
            value = window.popJSON.stringify(value);
          }
          json.push((arr ? "" : '"' + node + '":') + String(value));
        }
      }

      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
  }
};
