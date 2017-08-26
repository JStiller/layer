# layer
A simple layer handler

Requires an layer template and json

```html
<div class="layer">
  <p class="h1"></p>
  <button class="close" />
  <div class="content">
  </div>
</div>
```

```json
{
  "title": "Titel",
  "content": "Inhalt"
}
```

```js
jstiller.modules.layer.retrieveNode(function(receivedLayer) {
  if(receivedLayer.status === '200') {
    jstiller.components.ajax.getJSON('layer', function(receivedLayerData) {
      if(receivedLayer.status === '200') {
        jstiller.modules.layer.setInformation(receivedLayerData.responseJSON);
      }
    });
  }
});
```