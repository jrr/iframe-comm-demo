let targets = {
  unrestricted: "*",
  gitlab: "https://john-ruble.gitlab.io/",
  github: "https://jrr.github.io/",
};

let targetSelector = "input[name='restrict-target']:checked";

function sendMessageToIframe() {
  const targetRestriction =
    targets[document.querySelector(targetSelector).value];
  i = document.querySelector("iframe");
  i.contentWindow.postMessage("hello from parent", targetRestriction);
}

function sendMessageToParent() {
  const targetRestriction =
    targets[document.querySelector(targetSelector).value];
  window.parent.postMessage("Hello from iframe!", targetRestriction);
}

let originSelector = "input[name='restrict-origin']:checked";

function handleIncomingMessage(event) {
  const originRestriction = document.querySelector(originSelector).value;

  if (
    (originRestriction == "gitlab" && event.origin != targets["gitlab"]) ||
    (originRestriction == "github" && event.origin != targets["gitlab"])
  ) {
    console.error(`Rejecting message from unexpected origin ${event.origin}`);
    return;
  }

  // todo: validate message content

  // try {
  //   // cannot access document from a cross-origin message
  //   console.log(`event.source.document.URL=${event.source.document.URL}`);
  // } catch (e) {
  //   console.log(e);
  // }
  document.getElementById("message-buffer").append(event.data + "\n");
}
