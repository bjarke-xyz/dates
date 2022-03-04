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

const naturalDateForms = [...document.querySelectorAll("form[data-form=naturaldate]")]
for (const form of naturalDateForms) {
  form.onsubmit = onSubmitNaturalDate;
}
async function onSubmitNaturalDate(event) {
  event.preventDefault();
  const form = event.target;
  const path = form.dataset.path;
  const formData = new FormData(form);
  const inputFields = form.querySelectorAll("input:not([disabled])")
  const elementsToDisable = [...inputFields, ...form.querySelectorAll("button[type=submit]")]
  try {
    const urlSearchParams = new URLSearchParams(formData);
    urlSearchParams.set('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    setDisabled(elementsToDisable, true);
    const response = await fetch(`${baseUrl}/naturaldate/${path}?${urlSearchParams}`);
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
  // try {
  //   const urlSearchParams = new URLSearchParams(formData);
  //   setDisabled(elementsToDisable, true);
  //   const response = await fetch(`${baseUrl}/oadate/${path}?${urlSearchParams}`);
  //   const body = await response.json();
  //   const outputField = form.querySelectorAll("input[name=output]")[0]
  //   if (!response.ok) {
  //     const error = body.error ?? Object.values(body.errors).join(" ");
  //     outputField.value = error;
  //   } else {
  //     outputField.value = body.output;
  //     if (!inputFields[0].value) {
  //       inputFields[0].value = body.input;
  //     }
  //   }
  // } catch (error) {
  //   alert(error)
  //   console.error(error)
  // } finally {
  //   setDisabled(elementsToDisable, false);
  // }


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


/**
 * 
 * @param {Dayjs} date 
 * @returns {string} formatted date
 */
function formatDate(date) {
  // const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  // const padTime = (time) => {
  //   return time.toString().padStart(2, "0")
  // }
  // const timeStr = `${padTime(date.)}:${padTime(date.getHours())}:${padTime(date.getSeconds())}`
  // const str = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${timeStr}`
  const str = date.format("ddd DD MMM HH:mm:ss")
  return str;
}

const nowElem = document.getElementById("now")

/**
 * 
 * @param {Dayjs} date 
 */
function setDateValues(date) {
    nowElem.setAttribute('data-isostring', date.toISOString());
    const formattedDate = formatDate(date);
    nowElem.innerText = formattedDate;
    document.title = `Dates | ${formattedDate}`
}

function startDateSetter() {
  return setInterval(() => {
    const nowElemIsoString = nowElem.getAttribute('data-isostring');
    const parsedDate = dayjs(nowElemIsoString);
    const newDate = parsedDate.add(1, 'second');
    setDateValues(newDate)
  }, 1000);
}


let dateSetterInternval = null;

async function getInitialDate() {
  try {
    const response = await fetch("/api/v1/datetime/utcnow");
    const utcnow = (await response.json()).utcNow;
    const parsedDate = dayjs(utcnow);

    setDateValues(parsedDate);

    if (dateSetterInternval) {
      clearInterval(dateSetterInternval)
    }
    dateSetterInternval = startDateSetter();

  } catch (error) {
    console.log(`Could not get utcnow`, error);
  }
}
getInitialDate();
setInterval(() => {
  getInitialDate();
}, 10000)