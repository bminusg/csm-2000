(function () {
  var Plista = {};
  Plista.log = function () {
    try {
      console.log.apply(console, arguments);
    } catch (error) {}
  };
  Plista.getParentWindow = function () {
    try {
      if (window.parent !== window) {
        return window.parent;
      }
    } catch (error) {}
    return window;
  };
  Plista.getParameterByName = function (name) {
    var match = RegExp("[?&]" + name + "=([^&]*)").exec(
      window.location.hash ? window.location.href : window.location.search
    );
    return match && decodeURIComponent(match[1].replace(/\\\\\\+/g, " "));
  };
  Plista.getResourcePath = function () {
    var loc = window.location.href
      .split(/#/)
      .shift()
      .split(/\?/)
      .shift()
      .split(/\//);
    loc.pop();
    loc = loc.join("/");
    return loc;
  };
  Plista.getAdOptions = function () {
    var hash = window.location.hash.substr(1);
    hash = hash.split(/\?/);
    hash.pop();
    hash = decodeURIComponent(hash.join("?"));
    var adoptions = hash ? JSON.parse(hash) : window.adoptions;
    adoptions.apn_resources =
      adoptions.apn_resources || Plista.getResourcePath();
    return adoptions;
  };
  Plista.getItemMessage = function () {
    var adoptions = Plista.getAdOptions();
    adoptions.markup = adoptions.markup.replace(
      /\$\{RESOURCE_PATH\}/g,
      adoptions.apn_resources
    );
    return {
      PFAITEM: {
        url: Plista.getParameterByName("clickTag"),
        adoptions: adoptions,
      },
    };
  };
  Plista.onmessage = function (e) {
    if (!e || e.data !== "PFAINIT") {
      return;
    }
    Plista.log("PFAINIT");
    clearInterval(Plista.interval);
    Plista.getParentWindow().postMessage(Plista.getItemMessage(), "*");
  };
  Plista.register = function () {
    if (new Date().getTime() - Plista.startTime >= 20000) {
      clearInterval(Plista.interval);
    }
    Plista.log("PFAREGISTER");
    Plista.getParentWindow().postMessage("PFAREGISTER", "*");
  };
  Plista.init = function () {
    window.addEventListener("message", Plista.onmessage);
    Plista.startTime = new Date().getTime();
    Plista.interval = setInterval(Plista.register, 100);
    Plista.register();
  };
  Plista.init();
})();
