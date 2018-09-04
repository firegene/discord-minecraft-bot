const API_BASE = "/options";

function createOption(type, value, text, update) {
  let template = document.getElementById(type + "Option");

  let line = document.createElement("div");
  line.appendChild(document.importNode(template.content, true));

  let input = line.querySelector(".value");
  let textElement = line.querySelector(".text");

  let getValue = () => {
    switch(type){
      case 'boolean': return input.checked;
      case 'number': return Number(input.value);
      case 'string': return input.value;
      default:
        console.warn("Unknown type ",type,", loading by value anyway");
        return input.value
    }
  }
  let setValue = type === 'boolean' ? (val) => input.checked = val : (val) => input.value = val;

  textElement.innerText = text;
  setValue(value);

  line.querySelector(".value").onchange = (e) => update(getValue());
  return line;
}

var data;
fetch("/options")
  .then(res => res.json())
  .then(namespaces => {
    data = namespaces;
    let $container = document.getElementsByClassName("container")[0];
    for (let ns of Object.keys(namespaces)) {
      let $namespace = document.createElement("div");
      $namespace.classList.add("container");
      $namespace.classList.add("sub");
      let $label = document.createElement("h1");
      $label.textContent = ns;
      $namespace.appendChild($label);
      for (let option of Object.keys(namespaces[ns])) {
        console.log(namespaces[ns][option]);
        $namespace.appendChild(createOption(namespaces[ns][option].type, namespaces[ns][option].value, option, (val) => {
          namespaces[ns][option].newvalue = val
        }))
      }
      $container.appendChild($namespace);
    }
  });

async function save() {
  let promises = [];
  for (let ns of Object.keys(data)) {
    for (let option of Object.keys(data[ns])) {
      let newVal = data[ns][option].newvalue;
      let oldVal = data[ns][option].value;

      console.log(data, ns, option);
      if (newVal === undefined) continue;

      if (newVal !== oldVal) {
        promises.push(updateValue(ns, option, newVal));
      }
    }
  }
  if(promises.length === 0){
    return
  }

  let errSucc = document.getElementById("error-success");
  try {
    let resolved = await Promise.all(promises);
    errSucc.classList.remove("error");
    errSucc.classList.add("success");
    errSucc.textContent = "Successfully updated "+resolved.length+" options";
  } catch(e) {
    console.error(e);
    errSucc.classList.add("error");
    errSucc.classList.remove("success");
    errSucc.textContent = "Failed to save one or more of "+resolved.length+" options";
    return;
  }
  await sleep(1000);
  window.location.reload();
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function updateValue(ns, option, newVal) {
  return fetch(`${API_BASE}/${ns}/${option}`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({value: newVal}), // body data type must match "Content-Type" header
  })
}