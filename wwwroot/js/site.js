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
  const elementsToDisable = [...form.querySelectorAll("input:not([disabled])"), ...form.querySelectorAll("button[type=submit]")]
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
