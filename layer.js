var jstiller = jstiller || {};
jstiller.modules = jstiller.modules || {};

jstiller.modules.layer = (function Layer(dependency) {
  var estimatedTemplate = null;

  /**
   * Close / remove the layer
   *
   * @author José Stiller <jose.stiller@jstiller.de>
   * @param {event} deliveredEvent
   */
  function close(deliveredEvent) {
    deliveredEvent.preventDefault();

    if (deliveredEvent.type === 'keyup') {
      // @deprecated keyCode
      if (deliveredEvent.key.toLowerCase() === 'escape' || deliveredEvent.keyCode === 27) {
        dependency.dom.remove.element(estimatedTemplate);
      }
    } else if (deliveredEvent.type === 'click') {
      dependency.dom.remove.element(estimatedTemplate);
      dependency.document.removeEventListener('keyup', close);
    } else {
      throw new Error('unkown event');
    }
  }

  /**
   * Requests the layer template and delivers an node
   *
   * @author José Stiller <jose.stiller@jstiller.de>
   * @param {function} deliveredCallback
   */
  function retrieveNode(deliveredCallback) {
    dependency.ajax.getTemplate('layer.htm', function callbackTemplate(receivedTemplate) {
      if (receivedTemplate.status === 200) {
        // parsed string to get a node
        estimatedTemplate = dependency.dom.parse(receivedTemplate.response);

        var nodeCloseButton = dependency.dom.find('button.close', {
          context: estimatedTemplate,
        });

        // remove layer on escape
        dependency.document.addEventListener('keyup', close, {
          capture: false,
          once: true,
        });

        // remove layer on click or touch
        nodeCloseButton.addEventListener('click', close, false);

        if (deliveredCallback && typeof deliveredCallback === 'function') {
          deliveredCallback(estimatedTemplate);
        } else {
          throw new Error('missing callback');
        }
      } else {
        throw new Error('couldnt receive template');
      }
    });
  }

  /**
   * Provides an ability to insert information into the layer node
   *
   * @author José Stiller <jose.stiller@jstiller.de>
   * @param {object} deliveredInformation
   */
  function setInformation(deliveredInformation) {
    var nodeTitle = dependency.dom.parse(deliveredInformation.title),
      nodeContent = dependency.dom.parse(deliveredInformation.content);

    dependency.dom.insert.element(nodeTitle).into(dependency.dom.find('p.h1', {
      context: estimatedTemplate,
    }));
    dependency.dom.insert.element(nodeContent).into(dependency.dom.find('div.content', {
      context: estimatedTemplate,
    }));
  }

  return {
    close: close,
    retrieveNode: retrieveNode,
    setInformation: setInformation,
  };
}({
  dom: jstiller.components.dom,
  ajax: jstiller.modules.ajax,
  document: document,
}));
