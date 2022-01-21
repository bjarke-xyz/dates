const baseUrl = "/api/v1";

const fromOaDateForm = document.getElementById("oaDates_FromOaDateForm");
fromOaDateForm.onsubmit = onSubmitOaDate;

const toOaDateForm = document.getElementById("oaDates_ToOaDateForm");
toOaDateForm.onsubmit = onSubmitOaDate;

async function onSubmitOaDate(event) {
  event.preventDefault()
  const path = event.target.dataset.path;
  const formData = new FormData(event.target);
  try {
    const urlSearchParams = new URLSearchParams(formData);
    const response = await fetch(`${baseUrl}/oadate/${path}?${urlSearchParams}`);
    const body = await response.json();
    const output = document.getElementById(`${event.target.id}_output`);
    if (!response.ok) {
      const error = body.error ?? Object.values(body.errors).join(" ");
      output.value = error;
    } else {
      output.value = body.output;
    }
  } catch (error) {
    alert(error)
    console.error(error)
  }
}
