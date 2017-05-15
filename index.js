var echotest = null

Janus.init({
  debug: false,
  callback: function() {
    console.log('libreria inicializada')
  }
});

var janus = new Janus(
  {
    server: 'http://192.168.1.14:8088/janus',
    success: function() {
      janus.attach(
      {
        plugin: "janus.plugin.echotest",
        success: function(pluginHandle) {
                // Plugin attached! 'pluginHandle' is our handle
          console.log('plugin', pluginHandle)
          echotest = pluginHandle;
          var body = { "audio": true, "video": true };
          echotest.send({"message": body});
          echotest.createOffer(
            {
              media: { data: true },
              // No media property provided: by default,
                      // it's sendrecv for audio and video
              success: function(jsep) {
                // Got our SDP! Send our OFFER to the plugin
                console.log(jsep)
                echotest.send({"message": body, "jsep": jsep});
              },
              error: function(error) {
                console.log('error', error)
              }
            });
        },
        error: function(cause) {
          console.log('error', cause)
        },
        consentDialog: function(on) {
                // e.g., Darken the screen if on=true (getUserMedia incoming), restore it otherwise
        },
        onmessage: function(msg, jsep) {
          // Handle msg, if needed, and check jsep
          if(jsep !== undefined && jsep !== null) {
            debugger
            // We have the ANSWER from the plugin
            echotest.handleRemoteJsep({jsep: jsep});
          }
        },
        onlocalstream: function(stream) {
                // We have a local stream (getUserMedia worked!) to display
          console.log('local', stream)
        },
        onremotestream: function(stream) {
                // We have a remote stream (working PeerConnection!) to display
          console.log('remote', stream)
        },
        oncleanup: function() {
                // PeerConnection with the plugin closed, clean the UI
                // The plugin handle is still valid so we can create a new one
        },
        detached: function() {
                // Connection with the plugin closed, get rid of its features
                // The plugin handle is not valid anymore
          console.log('conexion cerrada')
        }
      });
    },
    error: function(cause) {
      console.log('error', cause)
    },
    destroyed: function() {
      console.log('destroyed')
    }
  });
