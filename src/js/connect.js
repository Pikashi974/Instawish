async function init() {
  try {
    var test = await window.api.getPage();
    if (test.status == 200) {
      location.href = "/dashboard";
    }
  } catch (error) {}
}

init();
