//returns lists of slots available
async function get_slots() {
    let response = await fetch("https://spreadsheets.google.com/feeds/cells/1CT8YGYORrT-DXoIC4rmmzfvCklcbpm3S-O0yS8OcIH0/od6/public/basic?alt=json")
    if (response.ok) {
      let resp = await response.json();
      let data = resp.feed.entry;
      var formatteddata = {}
      for(var key in data){
          var def = data[key].title.$t;
          if(!formatteddata[def.slice(1)]){formatteddata[def.slice(1)] = {}; }
          formatteddata[def.slice(1)][def[0]] = data[key].content.$t;
      };
      var result = {}
      for(var key in formatteddata){
        if(!formatteddata[key]['F'] || formatteddata[key]['F'] == 'slot') continue;
        result[formatteddata[key]['F']] = '';
      }
      return Object.keys(result);
    } else {
      alert("HTTP-Error: " + response.status);
    } 
  }
    
  //returns list of all the courses(detailed object) of a slot
  async function get_courses(slot) {
    let response = await fetch("https://spreadsheets.google.com/feeds/cells/1CT8YGYORrT-DXoIC4rmmzfvCklcbpm3S-O0yS8OcIH0/od6/public/basic?alt=json")
    if (response.ok) {
      let resp = await response.json();
      let data = resp.feed.entry;
      var formatteddata = {}
      for(var key in data){
          var def = data[key].title.$t;
          if(!formatteddata[def.slice(1)]){formatteddata[def.slice(1)] = {}; }
          formatteddata[def.slice(1)][def[0]] = data[key].content.$t;
      };
      var result = []
      for(var key in formatteddata){
        if(formatteddata[key]['F'] == slot) result.push(formatteddata[key])
      }
      return result;
    } else {
      alert("HTTP-Error: " + response.status);
    } 
  }
  
  //returns list of time slots of each day
  async function get_classes(slot) {
    let response = await fetch("https://spreadsheets.google.com/feeds/cells/1pEAMgjUp2eSSYmu__Szz6weCPsXd3Rtkv8MCnXT6rXw/od6/public/basic?alt=json")
    if (response.ok){
      let resp = await response.json();
      var data = resp.feed.entry;
      var formatteddata = {}
      for(var key in data){
          var def = data[key].title.$t;
          if(!formatteddata[def.slice(1)]){formatteddata[def.slice(1)] = {}; }
          formatteddata[def.slice(1)][def[0]] = data[key].content.$t;
      };
      var cols = {
          'A': 'Time',
          'B': 'Monday','D': 'Tuesday','F': 'Wednesday','H': 'Thursday','J': 'Friday',
          'C': 'Monday','E': 'Tuesday','G': 'Wednesday','I': 'Thursday','K': 'Friday',
      };
      var classes = {};
      for(var key in formatteddata){
          if(key==2){
            continue;
          }
          for(var col in formatteddata[key]){
              if(formatteddata[key][col][0] == slot[0]){
                  if(!classes[cols[col]]) classes[cols[col]] = []
                  classes[cols[col]].push(formatteddata[key]['A'])
              };
          };
      }
      for (var key in classes){
        for(var dkey in classes[key] ){
          var time = classes[key][dkey].split('-');
          var st = time[0].trim();
          var et = time[1].trim();
          classes[key][dkey] = {start: st, end: et};
        };
      };
      return classes;
    } else{
      alert("HTTP-Error: " + response.status);
    }
  }
  
  //returns the meet_link given the course code
  async function get_meetlink(course_code) {
    var response = await fetch("https://spreadsheets.google.com/feeds/cells/1CT8YGYORrT-DXoIC4rmmzfvCklcbpm3S-O0yS8OcIH0/od6/public/basic?alt=json")    
    if(response.ok){
    var resp = await response.json();
    var data = resp.feed.entry;
    var formatteddata = {}
    for(var key in data){
        var def = data[key].title.$t;
        if(!formatteddata[def.slice(1)]){formatteddata[def.slice(1)] = {}; }
        formatteddata[def.slice(1)][def[0]] = data[key].content.$t;
    };
    for(var key in formatteddata){
        if(formatteddata[key]['A'] == course_code) return formatteddata[key]['G']
    }
  }
  }

  export { get_slots , get_meetlink, get_classes, get_courses }