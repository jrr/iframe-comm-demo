let targets = {
  unrestricted: "*",
  gitlab: "https://john-ruble.gitlab.io",
  github: "https://jrr.github.io",
};

let targetSelector = "input[name='restrict-target']:checked";

function sendMessageToIframe(message) {
  const targetRestriction =
    targets[document.querySelector(targetSelector).value];
  i = document.querySelector("iframe");
  i.contentWindow.postMessage(message, targetRestriction);
}

function sendMessageToParent(message) {
  const targetRestriction =
    targets[document.querySelector(targetSelector).value];
  window.parent.postMessage(message, targetRestriction);
}

let originSelector = "input[name='restrict-origin']:checked";

function handleIncomingMessage(event) {
  const originRestriction = document.querySelector(originSelector).value;

  if (
    (originRestriction == "gitlab" && event.origin != targets["gitlab"]) ||
    (originRestriction == "github" && event.origin != targets["github"])
  ) {
    console.error(
      `Rejecting message from unexpected origin ${event.origin} (expected ${targets[originRestriction]})`
    );
    return;
  }

  const validateContent = document.querySelector(
    "input#validate-message"
  ).checked;

  if (validateContent && !validMessage(event.data)) {
    console.error(`Rejecting invalid message`);
    return;
  }

  // try {
  //   // cannot access document from a cross-origin message
  //   console.log(`event.source.document.URL=${event.source.document.URL}`);
  // } catch (e) {
  //   console.log(e);
  // }
  document.getElementById("message-buffer").append(event.data + "\n");
}

function validMessage(message) {
  return message.includes("hello");
}
