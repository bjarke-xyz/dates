const baseUrl = "/api/v1";

const oaDateForms = [...document.querySelectorAll("form[data-form=oadates]")]
for (const form of oaDateForms) {
  form.onsubmit = onSubmitOaDate;
}

async function onSubmitOaDate(event) {
  event.preventDefault()
  const form = event.target;
  const path = form.dataset.path;
  const formData = new FormData(form);
  const inputFields = form.querySelectorAll("input:not([disabled])")
  const elementsToDisable = [...inputFields, ...form.querySelectorAll("button[type=submit]")]
  try {
    const urlSearchParams = new URLSearchParams(formData);
    setDisabled(elementsToDisable, true);
    const response = await fetch(`${baseUrl}/oadate/${path}?${urlSearchParams}`);
    const body = await response.json();
    const outputField = form.querySelectorAll("input[name=output]")[0]
    if (!response.ok) {
      const error = body.error ?? Object.values(body.errors).join(" ");
      outputField.value = error;
    } else {
      outputField.value = body.output;
      if (!inputFields[0].value) {
        inputFields[0].value = body.input;
      }
    }
  } catch (error) {
    alert(error)
    console.error(error)
  } finally {
    setDisabled(elementsToDisable, false);
  }
}

/**
 * 
 * @param {NodeList} nodeList 
 * @param {bool} disabledStatus 
 */
function setDisabled(nodeList, disabledStatus) {
  for (const node of nodeList) {
    node.disabled = disabledStatus
  }
}
